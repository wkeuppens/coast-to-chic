/**
 * Emits a self-contained animated SVG (SMIL). No scripts, no external files —
 * drop it in an <img>, an <object>, a CSS background or a browser tab.
 *
 * Every animation runs for the full duration with baked keyTimes, so the
 * looping build stays in sync no matter when a viewer joins.
 */
import { SIERRA, WAVE, wavePath, waveCY, checkerCells, trianglePath } from './geometry.js';
import { stateAt, orderCells, totalDuration, when, TIMING } from './timeline.js';
import { DEFAULTS, layout, frame } from './lockup.js';

const f = (v, p = 4) => Number(v.toFixed(p)).toString();

/**
 * One <animate>/<animateTransform> track covering the whole timeline.
 * Sampled densely inside [t0,t1] and held flat either side, so a constant
 * stretch costs two keyframes instead of hundreds.
 */
function track(total, t0, t1, n, sample, { tag = 'animate', attr, type, loop, extra = '' }) {
  const times = [0];
  if (t0 > 0) times.push(t0);
  for (let i = 1; i <= n; i++) times.push(t0 + ((t1 - t0) * i) / n);
  if (t1 < total) times.push(total);
  const uniq = [...new Set(times.map((t) => Math.min(t, total)))].sort((a, b) => a - b);
  const keyTimes = uniq.map((t) => f(t / total, 6)).join(';');
  const values = uniq.map((t) => sample(t)).join(';');
  const rep = loop ? ' repeatCount="indefinite"' : ' fill="freeze"';
  const ty = type ? ` type="${type}"` : '';
  const add = type ? ' additive="sum"' : '';
  return `<${tag} attributeName="${attr}"${ty}${add} dur="${f(total, 3)}s" calcMode="linear" keyTimes="${keyTimes}" values="${values}"${rep}${extra}/>`;
}

export function buildAnimatedSVG(options = {}) {
  const o = { ...DEFAULTS, ...options };
  const L = layout(o);
  const { vbW, vbH, ox, oy } = frame(o, L);
  const total = totalDuration(o.loop);
  const T = TIMING;
  const ordered = orderCells(checkerCells(), o.order);
  const st = (t) => stateAt(t, { cellCount: ordered.length, waveCount: WAVE.count, loop: o.loop, pop: o.pop });

  /* wave mark */
  let ftc = '';
  for (let i = 0; i < WAVE.count; i++) {
    const { start: t0, dur } = when.wave(i);
    const a = track(total, t0, t0 + dur, 34, (t) => `${f(st(t).waves[i], 5)} 2`,
      { attr: 'stroke-dasharray', loop: o.loop });
    ftc += `<path d="${wavePath(waveCY(i))}" fill="none" stroke-width="${f(WAVE.stroke, 3)}" stroke-linecap="butt" pathLength="1" stroke-dasharray="0 2" stroke-dashoffset="0">${a}</path>`;
  }

  /* ✕ — one leg, then the other crossing it, each swinging in from an angle */
  const half = L.x.size / 2;
  const armD = [
    `M ${f(-half)} ${f(-half)} L ${f(half)} ${f(half)}`,
    `M ${f(half)} ${f(-half)} L ${f(-half)} ${f(half)}`,
  ];
  let arms = '';
  for (let i = 0; i < 2; i++) {
    const a = when.xArm(i);
    const sw = when.xSwing(i);
    const da = track(total, a.start, a.start + a.dur, 16,
      (t) => `${f(st(t).xArms[i].draw, 5)} 3`, { attr: 'stroke-dasharray', loop: o.loop });
    const rot = track(total, sw.start, sw.start + sw.dur, 18,
      (t) => f(st(t).xArms[i].rotate, 4),
      { tag: 'animateTransform', attr: 'transform', type: 'rotate', loop: o.loop });
    arms += `<g transform="rotate(0)">${rot}` +
      `<path d="${armD[i]}" fill="none" stroke-width="${f(L.x.stroke, 3)}" stroke-linecap="butt"` +
      ` pathLength="1" stroke-dasharray="0 3" stroke-dashoffset="0">${da}</path></g>`;
  }
  const xGroup = `<g transform="translate(${f(L.x.cx, 3)} ${f(L.x.cy, 3)})">${arms}</g>`;

  /* emblem */
  let cells = '';
  ordered.forEach(({ r, c }, i) => {
    const { start: t0, dur } = when.cell(i, ordered.length);
    const t1 = t0 + dur;
    const cx = (c + 0.5) * SIERRA.cellW, cy = (r + 0.5) * SIERRA.cellH;
    const sc = track(total, t0, t1, 8, (t) => { const v = f(st(t).cells[i].s, 5); return `${v} ${v}`; },
      { tag: 'animateTransform', attr: 'transform', type: 'scale', loop: o.loop });
    const op = track(total, t0, t1, 8, (t) => f(st(t).cells[i].o, 4), { attr: 'opacity', loop: o.loop });
    const w = SIERRA.cellW, h = SIERRA.cellH;
    cells += `<g transform="translate(${f(cx, 3)} ${f(cy, 3)})"><g opacity="0">${sc}${op}` +
      `<rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" stroke="none"/></g></g>`;
  });

  // Unique per build, so several of these SVGs can be inlined in one document
  // without their clip paths colliding.
  const clipId = 'ftcxsh-rise-' + [o.colour, o.fit, o.loop, o.order].join('-').replace(/[^a-z0-9]+/gi, '');
  const tri0 = when.triangle();
  const triY = track(total, tri0.start, tri0.start + tri0.dur, 22,
    (t) => f(SIERRA.height * (1 - st(t).triangle), 4), { attr: 'y', loop: o.loop });
  const triH = track(total, tri0.start, tri0.start + tri0.dur, 22,
    (t) => f(SIERRA.height * st(t).triangle, 4), { attr: 'height', loop: o.loop });
  const defs = `<defs><clipPath id="${clipId}" clipPathUnits="userSpaceOnUse">` +
    `<rect x="-10" y="${f(SIERRA.height, 3)}" width="${f(SIERRA.width + 20, 3)}" height="0">${triY}${triH}</rect></clipPath></defs>`;
  const tri = `<path d="${trianglePath()}" clip-path="url(#${clipId})" stroke-width="${f(Math.max(0, o.outset * 2))}"/>`;

  const fade = o.loop
    ? track(total, T.end, total, 6, (t) => f(st(t).globalAlpha, 4), { attr: 'opacity', loop: true })
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(vbW, 2)} ${f(vbH, 2)}" width="${Math.round(vbW)}" height="${Math.round(vbH)}" shape-rendering="geometricPrecision" role="img" aria-label="Follow the Coast × Sierra House">
<title>Follow the Coast × Sierra House</title>
<g fill="${o.colour}" stroke="${o.colour}">${fade}
<g transform="translate(${f(ox, 3)} ${f(oy, 3)})">
<g transform="translate(${f(L.ftc.x, 3)} ${f(L.ftc.y, 3)}) scale(${f(L.ftc.scale, 6)})">${ftc}</g>
${xGroup}
<g transform="translate(${f(L.sierra.x, 3)} ${f(L.sierra.y, 3)}) scale(${f(L.sierra.scale, 6)})">${defs}${cells}${tri}</g>
</g></g></svg>
`;
}
