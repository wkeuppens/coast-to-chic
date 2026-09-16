/**
 * Checks the exports against the live scene. Run it after any build:
 *
 *   node src/verify.mjs            # SVG + geometry checks
 *   node src/verify.mjs --video    # also decode the shipped webm and compare
 *
 * It exists because the SMIL export once drifted silently out of sync with the
 * frame renderer when the schedule was duplicated in two places.
 */
import fs from 'node:fs';

import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { render } from './render.mjs';
import { buildAnimatedSVG } from './build-svg.mjs';
import { SIERRA, checkerCells, inTriangle } from './geometry.js';
import { totalDuration } from './timeline.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../dist');
const WITH_VIDEO = process.argv.includes('--video');
const FPS = 60;
// Derived, not hardcoded: the timeline's length is free to change.
const LAST = Math.round(totalDuration(false) * FPS) - 1;
const LAST_LOOP = Math.round(totalDuration(true) * FPS) - 1;
const TIMES = [0, ...Array.from({ length: 11 }, (_, i) => Number(((i + 1) * totalDuration(false) / 12).toFixed(2)))];
const H = 700;

function chromium() {
  const require = createRequire(import.meta.url);
  for (const id of ['playwright', 'playwright-core']) {
    try { return require(id).chromium; } catch { /* next */ }
  }
  throw new Error('Playwright not found. Run `npm install` in brand/ftc-x-sierrahouse.');
}

/** PNG on disk -> data URI, so the canvas is not tainted by a file:// load. */
const dataURI = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

/** Compare two PNGs on their alpha channel, inside the browser via canvas. */
async function compare(page, a, b) {
  return page.evaluate(async ([ua, ub]) => {
    const load = (u) => new Promise((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = u;
    });
    const [ia, ib] = await Promise.all([load(ua), load(ub)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { error: `size ${ia.width}x${ia.height} vs ${ib.width}x${ib.height}` };
    const px = (img) => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.clearRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
      return x.getImageData(0, 0, c.width, c.height).data;
    };
    const A = px(ia), B = px(ib);
    let sum = 0, max = 0, inter = 0, union = 0, inkA = 0;
    for (let i = 3; i < A.length; i += 4) {
      const d = Math.abs(A[i] - B[i]);
      sum += d; if (d > max) max = d;
      const x = A[i] > 128, y = B[i] > 128;
      if (x) inkA++;
      if (x && y) inter++;
      if (x || y) union++;
    }
    return { mean: sum / (A.length / 4), max, iou: union ? inter / union : 1, inkA };
  }, [a, b]);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ftcx-verify-'));
const results = [];
const fail = (m) => { results.push(['FAIL', m]); };
const pass = (m) => { results.push(['ok  ', m]); };

/* ------------------------------------------------- geometry ------------- */
{
  let seams = 0;
  for (const { r, c } of checkerCells())
    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]])
      if (r + dr >= 0 && r + dr < SIERRA.rows && c + dc >= 0 && c + dc < SIERRA.cols && inTriangle(r + dr, c + dc)) seams++;
  seams === 0 ? pass('no checker square shares an edge with the pyramid')
              : fail(`${seams} checker/pyramid shared edge(s) — antialiasing seams will show`);
}

/* ------------------------------------------- SMIL vs frame renderer ------ */
{
  const refDir = path.join(tmp, 'ref');
  await render({ out: refDir, fps: 60, size: H, opts: { fit: 'tight' }, stills: TIMES.join(',') });

  const svg = buildAnimatedSVG({ fit: 'tight' });
  const [, vbW, vbH] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const W = Math.max(2, Math.round((H * vbW) / vbH / 2) * 2);
  const smilDir = path.join(tmp, 'smil');
  fs.mkdirSync(smilDir, { recursive: true });

  const browser = await chromium().launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${W}px;height:${H}px}</style>` + svg.replace(/<\?xml[^>]*\?>/, ''));
  await page.evaluate(() => document.querySelector('svg').pauseAnimations());
  for (const t of TIMES) {
    await page.evaluate((v) => document.querySelector('svg').setCurrentTime(v), t);
    await page.screenshot({ path: path.join(smilDir, `${t.toFixed(2)}.png`), omitBackground: true });
  }

  const cmp = await browser.newPage();
  await cmp.setContent('<body>');
  let worst = { iou: 1 }, meanSum = 0;
  for (const t of TIMES) {
    const r = await compare(cmp,
      dataURI(path.join(refDir, `still_${t.toFixed(2)}.png`)),
      dataURI(path.join(smilDir, `${t.toFixed(2)}.png`)));
    if (r.error) { fail(`SMIL t=${t}: ${r.error}`); continue; }
    meanSum += r.mean;
    if (r.iou < worst.iou) worst = { ...r, t };
    if (t === 0 && r.inkA !== 0) fail(`first frame is not empty — ${r.inkA} pixels of ink at t=0`);
  }
  const meanAvg = meanSum / TIMES.length;
  (worst.iou > 0.98 && meanAvg < 0.1)
    ? pass(`SMIL matches the frame renderer — mean alpha error ${meanAvg.toFixed(4)}/255, worst IoU ${worst.iou.toFixed(5)} at t=${worst.t}s`)
    : fail(`SMIL has drifted from the frame renderer — mean alpha error ${meanAvg.toFixed(4)}/255, worst IoU ${worst.iou.toFixed(5)} at t=${worst.t}s`);
  pass('first frame is completely empty');
  await browser.close();
}

/* --------------------------------------------------- shipped video ------- */
if (WITH_VIDEO) {
  const webm = path.join(DIST, 'webm', 'ftc-x-sierrahouse-black-tight.webm');
  const loop = path.join(DIST, 'webm', 'ftc-x-sierrahouse-black-tight-loop.webm');
  if (!fs.existsSync(webm)) fail('dist/webm not built — run `npm run build` first');
  else {
    const browser = await chromium().launch();
    const page = await browser.newPage();
    await page.setContent('<body>');

    // Decode each colourway's last frame and measure what the encoder did to it.
    // VP9 keeps its alpha in a side channel: ffmpeg's native decoder drops it.
    const INK = { black: [0, 0, 0], white: [255, 255, 255], offwhite: [244, 237, 230] };
    for (const [cname, rgb] of Object.entries(INK)) {
      const f = path.join(DIST, 'webm', `ftc-x-sierrahouse-${cname}-tight.webm`);
      if (!fs.existsSync(f)) continue;
      const dir = path.join(tmp, 'dec-' + cname); fs.mkdirSync(dir, { recursive: true });
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-c:v', 'libvpx-vp9', '-i', f,
        '-vf', `select='eq(n\\,${LAST})'`, '-vsync', '0', '-pix_fmt', 'rgba', path.join(dir, '%02d.png')]);
      const r = await page.evaluate(async ([u, want]) => {
        const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = u; });
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.clearRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        let opaque = 0, exact = 0, worst = 0, sum = 0, edge = 0, edgeInk = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] > 250) {
            opaque++;
            const e = Math.max(Math.abs(d[i] - want[0]), Math.abs(d[i + 1] - want[1]), Math.abs(d[i + 2] - want[2]));
            if (e === 0) exact++;
            if (e > worst) worst = e;
            sum += e;
          } else if (d[i + 3] > 60 && d[i + 3] < 200) {
            // straight alpha keeps the ink colour on partly transparent pixels;
            // premultiplied alpha would drag them toward the matte
            edge++;
            const e = Math.max(Math.abs(d[i] - want[0]), Math.abs(d[i + 1] - want[1]), Math.abs(d[i + 2] - want[2]));
            if (e < 48) edgeInk++;
          }
        }
        return { opaque, exact, worst, mean: sum / opaque, edge, edgeInk };
      }, [dataURI(path.join(dir, '01.png')), rgb]);
      const pct = (100 * r.exact) / r.opaque;
      const line = `${cname} in webm: ${pct.toFixed(1)}% of opaque pixels exact, mean channel error ${r.mean.toFixed(2)}/255, worst ${r.worst}/255`;
      r.mean < 3 ? pass(line) : fail(line + ' — larger than expected');
      r.edgeInk === r.edge
        ? pass(`${cname}: alpha is straight, not premultiplied — partly transparent edges still carry the ink colour`)
        : fail(`${cname}: ${r.edge - r.edgeInk}/${r.edge} edge pixels lost the ink colour — alpha looks premultiplied`);
    }

    // The lossless MOV must be bit-exact.
    for (const cname of ['black', 'white']) {
      const f = path.join(DIST, 'mov', `ftc-x-sierrahouse-${cname}-tight.mov`);
      if (!fs.existsSync(f)) continue;
      const dir = path.join(tmp, 'mov-' + cname); fs.mkdirSync(dir, { recursive: true });
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', f, '-vf', `select='eq(n\\,${LAST})'`,
        '-vsync', '0', '-pix_fmt', 'rgba', path.join(dir, '%02d.png')]);
      const want = cname === 'black' ? [0, 0, 0] : [255, 255, 255];
      const r = await page.evaluate(async ([u, w]) => {
        const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = u; });
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.clearRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        let opaque = 0, exact = 0;
        for (let i = 0; i < d.length; i += 4)
          if (d[i + 3] > 250) { opaque++; if (d[i] === w[0] && d[i + 1] === w[1] && d[i + 2] === w[2]) exact++; }
        return { opaque, exact };
      }, [dataURI(path.join(dir, '01.png')), want]);
      r.exact === r.opaque
        ? pass(`${cname} in mov: all ${r.opaque} opaque pixels exact — lossless`)
        : fail(`${cname} in mov: only ${r.exact}/${r.opaque} opaque pixels exact, but qtrle is lossless`);
    }
    await browser.close();

    if (fs.existsSync(loop)) {
      const ldir = path.join(tmp, 'loop'); fs.mkdirSync(ldir, { recursive: true });
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-c:v', 'libvpx-vp9', '-i', loop,
        '-vf', `select='eq(n\\,0)+eq(n\\,${LAST_LOOP})'`, '-vsync', '0', '-pix_fmt', 'rgba', path.join(ldir, '%02d.png')]);
      const b2 = await chromium().launch();
      const p2 = await b2.newPage(); await p2.setContent('<body>');
      const ink = await p2.evaluate(async (u) => {
        const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = u; });
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.clearRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 20) n++;
        return n;
      }, dataURI(path.join(ldir, '02.png')));
      ink === 0 ? pass('looping build returns to an empty frame, so it restarts seamlessly')
                : fail(`looping build ends with ${ink} pixels of ink — the loop will jump`);
      await b2.close();
    }
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
for (const [tag, msg] of results) console.log(`${tag}  ${msg}`);
const failed = results.filter(([t]) => t === 'FAIL').length;
console.log(failed ? `\n${failed} check(s) failed.` : `\nAll ${results.length} checks passed.`);
process.exit(failed ? 1 : 0);
