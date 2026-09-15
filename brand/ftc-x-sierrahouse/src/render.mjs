/**
 * Renders the lockup animation to a transparent PNG sequence with Chromium.
 *   node render.mjs --out DIR --fps 60 --size 1440 [--opts '{"colour":"#fff"}'] [--stills 0,1.3,2.5]
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

/** Chromium rasterises the scene. CJS resolution so both a local install and a
 *  global one (NODE_PATH) work; Node's ESM resolver honours neither. */
function loadChromium() {
  const require = createRequire(import.meta.url);
  for (const id of ['playwright', 'playwright-core']) {
    try { return require(id).chromium; } catch { /* try the next one */ }
  }
  throw new Error('Playwright not found. Run `npm install` in brand/ftc-x-sierrahouse.');
}


const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };

/** Chromium refuses ES-module imports over file://, so serve the scene locally. */
function serve(dir) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const f = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, base: `http://127.0.0.1:${srv.address().port}` }));
  });
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };

const out = arg('out', path.join(HERE, '../.frames'));
const fps = Number(arg('fps', 60));
const size = Number(arg('size', 1440));
const opts = JSON.parse(arg('opts', '{}'));
const stills = arg('stills', null);

export async function render({ out, fps, size, opts, stills }) {
  fs.mkdirSync(out, { recursive: true });
  const { srv, base } = await serve(HERE);
  const browser = await loadChromium().launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text'] });

  // Work out the canvas shape before sizing the viewport.
  const probe = await browser.newPage({ viewport: { width: 100, height: 100 } });
  await probe.goto(base + '/frame.html?opts=' + encodeURIComponent(JSON.stringify(opts)));
  await probe.waitForFunction('window.__ready === true');
  const { vb, duration } = await probe.evaluate(() => ({ vb: window.__scene.viewBox, duration: window.__scene.duration }));
  await probe.close();

  const aspect = vb[0] / vb[1];
  // Even dimensions: chroma-subsampled alpha (yuva420p) and H.264 both reject
  // odd widths. The viewBox letterboxes into the rounded box, so at most half a
  // pixel of transparent margin is added.
  const even = (v) => Math.max(2, Math.round(v / 2) * 2);
  const W = even(aspect >= 1 ? size : size * aspect);
  const H = even(aspect >= 1 ? size / aspect : size);
  // No shape in the lockup shares an edge with another, so nothing needs an
  // outset to hide a seam. Kept as an option for odd rasterisers only.
  const outset = opts.outset ?? 0;

  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(base + '/frame.html?opts=' + encodeURIComponent(JSON.stringify({ ...opts, outset })));
  await page.waitForFunction('window.__ready === true');

  const times = stills
    ? stills.split(',').map(Number)
    : Array.from({ length: Math.round(duration * fps) }, (_, i) => i / fps);

  for (let i = 0; i < times.length; i++) {
    await page.evaluate((t) => window.__setTime(t), times[i]);
    await page.screenshot({
      path: path.join(out, stills ? `still_${times[i].toFixed(2)}.png` : `f${String(i).padStart(5, '0')}.png`),
      omitBackground: true,
    });
  }
  await browser.close();
  srv.close();
  return { frames: times.length, W, H, duration, fps };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const r = await render({ out, fps, size, opts, stills });
  console.log(JSON.stringify(r));
}
