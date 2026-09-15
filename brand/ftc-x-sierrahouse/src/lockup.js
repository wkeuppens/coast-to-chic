/**
 * Lockup composition: defaults, metrics and canvas framing.
 * DOM-free, so the live scene, the frame renderer and the SMIL export all
 * measure the composition the same way.
 */
import { SIERRA, WAVE } from './geometry.js';

export const DEFAULTS = {
  colour: '#000000',
  /**
   * Wave-mark width as a fraction of the Sierra emblem's width. 1.0 puts both
   * marks on one shared measure: the wave's terminals are cut on a true
   * vertical and the emblem is full-bleed, so the edges line up exactly and the
   * stack reads as a single column rather than two logos near each other.
   * The extra 1% is optical overshoot: the wave's edge is five butt-cut
   * terminals with air between them, so it reads a touch narrow against the
   * emblem's hard edge — the same correction a round letterform gets over a flat one.
   */
  ftcRatio: 1.01,
  /**
   * Gaps above and below the ✕. The lower gap is the larger of the two: the
   * wave's underside is scalloped so its optical edge sits above its bounding
   * box, while the emblem's top is a hard full-bleed edge that crowds the ✕.
   */
  gapTop: 0.072,
  gapBottom: 0.086,
  /** ✕ bounding box, as a fraction of the Sierra emblem's width. */
  xSize: 0.12,
  /** ✕ stroke weight, as a fraction of the wave stroke at lockup scale. */
  xStrokeOfWave: 0.68,
  padding: 0.07,  // canvas padding as a fraction of the lockup's long side
  fit: 'square',  // 'square' | 'tight'
  order: 'scatter',
  pop: 'snap',
  loop: false,
  outset: 0,      // shape outset in user units, closes antialiasing seams
};

/** Lockup metrics in a space where the Sierra emblem is 1000 units wide. */
export function layout(o) {
  const S = 1000;
  const sierraH = (S / SIERRA.width) * SIERRA.height;
  const ftcW = S * o.ftcRatio;
  const ftcH = (ftcW / WAVE.width) * WAVE.height;
  const gapTop = S * o.gapTop;
  const gapBottom = S * o.gapBottom;
  const xS = S * o.xSize;
  const waveStroke = WAVE.stroke * (ftcW / WAVE.width);
  const height = ftcH + gapTop + xS + gapBottom + sierraH;
  const width = Math.max(S, ftcW); // the wave may sit a hair proud of the emblem
  return {
    width, height,
    ftc: { x: (width - ftcW) / 2, y: 0, w: ftcW, h: ftcH, scale: ftcW / WAVE.width },
    x: { cx: width / 2, cy: ftcH + gapTop + xS / 2, size: xS, stroke: waveStroke * o.xStrokeOfWave },
    module: S / SIERRA.cols,
    sierra: { x: (width - S) / 2, y: ftcH + gapTop + xS + gapBottom, w: S, h: sierraH, scale: S / SIERRA.width },
  };
}

/** Canvas viewBox and the offset that centres the lockup inside it. */
export function frame(o, L) {
  let vbW, vbH;
  if (o.fit === 'square') {
    const side = Math.max(L.width, L.height) * (1 + 2 * o.padding);
    vbW = vbH = side;
  } else {
    const pad = Math.max(L.width, L.height) * o.padding;
    vbW = L.width + 2 * pad;
    vbH = L.height + 2 * pad;
  }
  return { vbW, vbH, ox: (vbW - L.width) / 2, oy: (vbH - L.height) / 2 };
}
