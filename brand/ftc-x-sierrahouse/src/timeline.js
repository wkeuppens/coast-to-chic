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
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  /** The gentlest S there is — no sudden change of acceleration anywhere. */
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
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
  waveStagger: 0.095,
  waveDraw: 1.1,

  // The ✕ is drawn as two separate strokes: one leg lands, then the other
  // crosses it. Each swings into place from an angle as it draws.
  xStart: 1.3,
  xArmDraw: 0.46,
  xArmStagger: 0.26, // long enough to read as "one, then the other"
  xArmSettle: 0.18,  // the swing keeps easing out after the stroke is complete
  xArmSwing: 26,     // degrees each leg travels, opposite ways

  checkerStart: 1.98,
  checkerSpread: 2.4, // time between the first and last square *starting*
  checkerPop: 0.34,

  triStart: 4.88, // a beat after the last square, long enough to read the hole
  triFill: 1.05,

  end: 7.0,
  fadeOut: 0.6, // only used by the looping variant
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
  /** The swing outlasts the stroke, so each leg settles rather than stopping. */
  xSwing: (i) => ({ start: TIMING.xStart + i * TIMING.xArmStagger, dur: TIMING.xArmDraw + TIMING.xArmSettle }),
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
      start: TIMING.checkerStart + TIMING.checkerSpread * (0.72 * k + 0.28 * easing.outInCubic(k)),
      dur: TIMING.checkerPop,
    };
  },
};

/* ----------------------------------------------------------------- state -- */
/**
 * Full animation state at time `t`.
 *  waves[i]    0..1 draw progress
 *  xArms[i]    { draw: 0..1 stroke progress, rotate: degrees still to swing }
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
    waves.push(easing.inOutSine(span(t, w.start, w.dur)));
  }

  // Leg 0 runs top-left to bottom-right, leg 1 crosses it the other way. Each
  // is drawn end to end while swinging in from an angle, the two from opposite
  // sides, so the second visibly crosses the first.
  const xArms = [0, 1].map((i) => {
    const a = when.xArm(i);
    const sw = when.xSwing(i);
    const dir = i === 0 ? -1 : 1;
    return {
      draw: easing.inOutSine(span(t, a.start, a.dur)),
      rotate: dir * T.xArmSwing * (1 - easing.outCubic(span(t, sw.start, sw.dur))),
    };
  });

  const cells = [];
  for (let i = 0; i < cellCount; i++) {
    const c = when.cell(i, cellCount);
    const p = span(t, c.start, c.dur);
    if (pop === 'hard') {
      cells.push({ s: 1, o: p > 0 ? 1 : 0 });
    } else {
      // No overshoot. A back-eased pop on 98 squares reads as chatter; a plain
      // ease-out that lets opacity lead the scale reads as the squares settling.
      cells.push({ s: 0.72 + 0.28 * easing.outCubic(p), o: easing.outQuad(Math.min(1, p * 1.45)) });
    }
  }

  // Sweep the pyramid's AREA, not its height. Its base row is the full width of
  // the emblem and carries 13% of its ink, so a height sweep dumped that in a
  // single frame and then crawled up the thin tip. Inverting a triangle's area,
  // A = 1-(1-u)^2, gives a fill that reads at a constant rate.
  //
  // The ease is a blend with a linear ramp rather than a plain inOutCubic: a
  // pure S has zero velocity at its start, which held the picture for another
  // five frames after the fill was meant to begin and squeezed the readable
  // part of the sweep into 0.35s of an authored 0.86s.
  const tri = when.triangle();
  const p = span(t, tri.start, tri.dur);
  const filled = 0.5 * p + 0.5 * easing.inOutSine(p);
  const triangle = 1 - Math.sqrt(1 - filled);

  let globalAlpha = 1;
  if (loop && t > T.end) globalAlpha = 1 - easing.inOutCubic(span(t, T.end, T.fadeOut));

  return { waves, xArms, cells, triangle, globalAlpha };
}
