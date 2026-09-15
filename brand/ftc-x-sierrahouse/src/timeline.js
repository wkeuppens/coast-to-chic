/**
 * Timing model for the Follow the Coast × Sierra House lockup animation.
 *
 * Everything here is a pure function of time, so the preview, the frame
 * renderer, the SMIL export and the Lottie export all describe the same motion.
 */

/* ---------------------------------------------------------------- easing -- */
export const easing = {
  linear: (t) => t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t, s = 1.45) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Local 0..1 progress of a window starting at `start` and lasting `dur`. */
export const span = (t, start, dur) => clamp01((t - start) / dur);

/* -------------------------------------------------------------- schedule -- */
export const TIMING = {
  waveStart: 0.0,
  waveStagger: 0.085,
  waveDraw: 0.95,

  xStart: 1.12,
  xArmDraw: 0.34,
  xArmStagger: 0.1,

  checkerStart: 1.5,
  checkerSpread: 2.05, // time between first and last cell *starting*
  checkerPop: 0.22,

  triStart: 3.98,
  triFill: 0.86,

  end: 6.0,
  fadeOut: 0.5, // only used by the looping variant
};

export const totalDuration = (loop) => TIMING.end + (loop ? TIMING.fadeOut : 0);

/* ------------------------------------------------- deterministic ordering -- */
/** Mulberry32 — small, seeded, identical in every export path. */
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Orders the checker cells. `scatter` is the default: a seeded shuffle, so the
 * squares land all over the emblem and the triangle-shaped hole only resolves
 * once the last few arrive.
 */
export function orderCells(cells, mode = 'scatter', seed = 20260915) {
  const c = cells.map((v, i) => ({ ...v, i }));
  const key = {
    scatter: null, // handled below
    scan: (a) => a.r * 1000 + a.c,
    columns: (a) => a.c * 1000 + a.r,
    diagonal: (a) => (a.r + a.c) * 1000 + a.r,
    rise: (a) => -a.r * 1000 + a.c,
    radial: (a) => Math.hypot((a.c - 14) * 0.52, a.r - 14) * 1000,
  }[mode];
  if (mode === 'scatter') {
    const rand = rng(seed);
    const w = c.map((v) => ({ v, k: rand() }));
    w.sort((a, b) => a.k - b.k);
    return w.map((x) => x.v);
  }
  return c.sort((a, b) => key(a) - key(b));
}

/* ----------------------------------------------------------------- state -- */
/**
 * Full animation state at time `t`.
 *  waves[i]    0..1 draw progress
 *  xArms[i]    0..1 draw progress, xScale = settle scale
 *  cells[i]    { s: scale, o: opacity } for the i-th cell in animation order
 *  triangle    0..1 fill height, measured from the base upwards
 *  globalAlpha 1, except during the loop variant's tail fade
 */
export function stateAt(t, opts = {}) {
  const { cellCount = 99, waveCount = 5, loop = false, pop = 'snap' } = opts;
  const T = TIMING;

  const waves = [];
  for (let i = 0; i < waveCount; i++)
    waves.push(easing.inOutCubic(span(t, T.waveStart + i * T.waveStagger, T.waveDraw)));

  const xArms = [0, 1].map((i) =>
    easing.outCubic(span(t, T.xStart + i * T.xArmStagger, T.xArmDraw))
  );
  const xScale = 0.86 + 0.14 * easing.outBack(span(t, T.xStart, T.xArmDraw + T.xArmStagger + 0.12), 2.2);

  const cells = [];
  const step = cellCount > 1 ? T.checkerSpread / (cellCount - 1) : 0;
  for (let i = 0; i < cellCount; i++) {
    const p = span(t, T.checkerStart + i * step, T.checkerPop);
    if (pop === 'hard') {
      cells.push({ s: 1, o: p > 0 ? 1 : 0 });
    } else {
      cells.push({ s: 0.38 + 0.62 * easing.outBack(p, 1.9), o: easing.outQuart(Math.min(1, p * 1.9)) });
    }
  }

  const triangle = easing.outCubic(span(t, T.triStart, T.triFill));

  let globalAlpha = 1;
  if (loop && t > T.end) globalAlpha = 1 - easing.inOutCubic(span(t, T.end, T.fadeOut));

  return { waves, xArms, xScale, cells, triangle, globalAlpha };
}
