/**
 * Builds every distributable from one source of truth.
 *
 *   node build.mjs [--only svg|video] [--size 1440]
 *
 * Frames come out of Chromium with a genuinely empty background (no matte),
 * so the alpha channel is straight, not premultiplied. ffmpeg then encodes
 * each container without touching it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { render } from './render.mjs';
import { buildAnimatedSVG } from './build-svg.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../dist');
const TMP = path.resolve(HERE, '../.frames');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const SIZE = Number(arg('size', 1440));
const ONLY = arg('only', null);
const FPS = 60;

const COLOURS = {
  black: '#000000',
  white: '#FFFFFF',
  offwhite: '#F4EDE6', // Sierra House brand off-white, straight from the .ai files
};
const INK = '#032d47'; // Follow the Coast coast-blue, used only to matte GIF/MP4 previews

const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
const mk = (d) => fs.mkdirSync(d, { recursive: true });
const name = (colour, fit, loop) => `ftc-x-sierrahouse-${colour}-${fit}${loop ? '-loop' : ''}`;

/* ------------------------------------------------------------------ SVG -- */
function buildSVGs() {
  const dir = path.join(DIST, 'svg'); mk(dir);
  const out = [];
  for (const [cname, colour] of Object.entries(COLOURS))
    for (const fit of ['tight', 'square'])
      for (const loop of [false, true]) {
        const file = path.join(dir, name(cname, fit, loop) + '.svg');
        fs.writeFileSync(file, buildAnimatedSVG({ colour, fit, loop }));
        out.push(file);
      }
  return out;
}

/* ---------------------------------------------------------------- video -- */
async function buildVideo(cname, fit, loop) {
  const base = name(cname, fit, loop);
  const frames = path.join(TMP, base);
  fs.rmSync(frames, { recursive: true, force: true });
  const meta = await render({ out: frames, fps: FPS, size: SIZE, opts: { colour: COLOURS[cname], fit, loop } });
  const seq = path.join(frames, 'f%05d.png');
  const made = [];
  const matte = cname === 'black' ? '#F7F6F3' : INK;
  const dur = meta.frames / FPS;
  // color= is an endless source: without d= and shortest=1 the overlay never
  // terminates and ffmpeg runs until it is killed.
  const onMatte = `color=${matte}:s=${meta.W}x${meta.H}:r=${FPS}:d=${dur}[bg];` +
                  `[bg][0:v]overlay=format=auto:shortest=1`;

  // VP9 with alpha — the only transparent video format the web reads directly.
  mk(path.join(DIST, 'webm'));
  const webm = path.join(DIST, 'webm', base + '.webm');
  ff(['-framerate', String(FPS), '-i', seq, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
      '-b:v', '0', '-crf', '24', '-row-mt', '1', '-auto-alt-ref', '0', '-deadline', 'good', '-cpu-used', '3',
      webm]);
  made.push(webm);

  const primary = fit === 'tight' && (cname === 'black' || cname === 'white');

  if (primary && !loop) {
    // QuickTime Animation (RLE): lossless straight alpha, opens in every NLE and
    // about 5x smaller than ProRes 4444 for flat vector artwork. Only the tight
    // crop is shipped — with a transparent background, padding it out to any
    // other aspect in an editor costs nothing.
    mk(path.join(DIST, 'mov'));
    const mov = path.join(DIST, 'mov', base + '.mov');
    ff(['-framerate', String(FPS), '-i', seq, '-c:v', 'qtrle', '-pix_fmt', 'argb', mov]);
    made.push(mov);

    // A matted MP4 so the animation can be watched anywhere. Plays once and holds.
    mk(path.join(DIST, 'preview'));
    const mp4 = path.join(DIST, 'preview', base + `-on-${cname === 'black' ? 'paper' : 'ink'}.mp4`);
    ff(['-framerate', String(FPS), '-i', seq, '-filter_complex', `${onMatte},format=yuv420p`,
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', mp4]);
    made.push(mp4);
  }

  if (primary && loop) {
    // APNG and GIF repeat by nature, so they are cut from the looping timeline.
    // Built from the one-shot they would hard-cut from the finished lockup
    // straight back to an empty frame every time round.
    mk(path.join(DIST, 'apng'));
    const apng = path.join(DIST, 'apng', base + '.png');
    ff(['-framerate', String(FPS), '-i', seq, '-plays', '0', '-f', 'apng', apng]);
    made.push(apng);

    // GIF alpha is 1-bit, so this one is flattened on purpose rather than
    // shipped with chewed-up edges. Two passes with the palette on disk: one
    // command with split[] buffers every frame and gets OOM-killed.
    mk(path.join(DIST, 'preview'));
    const gif = path.join(DIST, 'preview', base + `-on-${cname === 'black' ? 'paper' : 'ink'}.gif`);
    const flat = `${onMatte},fps=25,scale=520:-1:flags=lanczos`;
    const pal = path.join(TMP, base + '-palette.png');
    ff(['-framerate', String(FPS), '-i', seq, '-filter_complex', `${flat},palettegen=stats_mode=diff`, pal]);
    ff(['-framerate', String(FPS), '-i', seq, '-i', pal,
        '-filter_complex', `${flat}[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=3`, gif]);
    fs.rmSync(pal, { force: true });
    made.push(gif);
  }

  fs.rmSync(frames, { recursive: true, force: true });
  return { meta, made };
}

/* ----------------------------------------------------------------- main -- */
mk(DIST);
if (ONLY !== 'video') console.log('svg:', buildSVGs().length, 'files');
if (ONLY !== 'svg') {
  const jobs = [];
  for (const c of Object.keys(COLOURS)) for (const fit of ['tight', 'square']) jobs.push([c, fit, false]);
  for (const c of ['black', 'white']) jobs.push([c, 'tight', true]);
  for (const [c, fit, loop] of jobs) {
    const { meta, made } = await buildVideo(c, fit, loop);
    console.log(`${name(c, fit, loop)}  ${meta.W}x${meta.H} ${meta.frames}f  ->  ` +
      made.map((f) => `${path.basename(f)} ${(fs.statSync(f).size / 1048576).toFixed(2)}MB`).join('  '));
  }
}
fs.rmSync(TMP, { recursive: true, force: true });
