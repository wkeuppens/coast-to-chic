/**
 * Timing model for the Follow the Coast × Sierra House lockup animation.
 *
 * Everything here is a pure function of time, so the preview, the frame
 * renderer and the SMIL export all describe exactly the same motion.
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
  /**
   * Fast at both ends, slow through the middle — the mirror of inOutCubic.
   * Used on the squares' start times, where advancing the schedule quickly
   * means the squares arrive slowly.
   */
  outInCubic: (t) => (t < 0.5 ? 0.5 * (1 - Math.pow(1 - 2 * t, 3)) : 0.5 + 0.5 * Math.pow(2 * t - 1, 3)),
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
  xArmStagger: 0.04, // longer and the first arm reads as a lone slash

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

/* -------------------------------------------------------------- schedule -- */
/**
 * When each animated element starts and how long it runs. `stateAt` reads this,
 * and so does every exporter — duplicating the arithmetic is how the SMIL build
 * silently drifted out of sync with the frame renderer once before.
 */
export const when = {
  wave: (i) => ({ start: TIMING.waveStart + i * TIMING.waveStagger, dur: TIMING.waveDraw }),
  xArm: (i) => ({ start: TIMING.xStart + i * TIMING.xArmStagger, dur: TIMING.xArmDraw }),
  xScale: () => ({ start: TIMING.xStart, dur: TIMING.xArmDraw + TIMING.xArmStagger + 0.12 }),
  triangle: () => ({ start: TIMING.triStart, dur: TIMING.triFill }),
  /**
   * Squares are spread on an arc, not a constant interval. At a flat rate all 98
   * land about one frame apart and nothing reads "checker by checker"; this
   * opens the first few out to roughly 40 ms, flurries through the middle, then
   * settles again so the triangular hole is seen closing.
   */
  cell: (i, count) => {
    const k = count > 1 ? i / (count - 1) : 0;
    return {
      start: TIMING.checkerStart + TIMING.checkerSpread * (0.5 * k + 0.5 * easing.outInCubic(k)),
      dur: TIMING.checkerPop,
    };
  },
};

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
  for (let i = 0; i < waveCount; i++) {
    const w = when.wave(i);
    waves.push(easing.inOutCubic(span(t, w.start, w.dur)));
  }

  const xArms = [0, 1].map((i) => {
    const a = when.xArm(i);
    return easing.outCubic(span(t, a.start, a.dur));
  });
  const xs = when.xScale();
  const xScale = 0.86 + 0.14 * easing.outBack(span(t, xs.start, xs.dur), 2.2);

  const cells = [];
  for (let i = 0; i < cellCount; i++) {
    const c = when.cell(i, cellCount);
    const p = span(t, c.start, c.dur);
    if (pop === 'hard') {
      cells.push({ s: 1, o: p > 0 ? 1 : 0 });
    } else {
      cells.push({ s: 0.38 + 0.62 * easing.outBack(p, 1.9), o: easing.outQuart(Math.min(1, p * 1.9)) });
    }
  }

  // Sweep the pyramid's AREA, not its height. Its base row is the full width of
  // the emblem and carries 13% of its ink, so a height sweep dumped that in a
  // single frame and then crawled up the thin tip. Inverting a triangle's area,
  // A = 1-(1-u)^2, gives a fill that reads at a constant rate.
  const tri = when.triangle();
  const filled = easing.inOutCubic(span(t, tri.start, tri.dur));
  const triangle = 1 - Math.sqrt(1 - filled);

  let globalAlpha = 1;
  if (loop && t > T.end) globalAlpha = 1 - easing.inOutCubic(span(t, T.end, T.fadeOut));

  return { waves, xArms, xScale, cells, triangle, globalAlpha };
}
