/**
 * Geometry for the Follow the Coast × Sierra House collaboration lockup.
 *
 * Both marks are rebuilt as exact vector geometry so the animation stays crisp
 * at any resolution.
 *
 *  - Sierra House emblem: decoded from sierrahouse-emblem-rgb-*.ai — a 29x15
 *    grid of cells. A cell carries ink when (row + col) is even (checkerboard)
 *    or when it sits inside the stepped pyramid, which spans columns 14±row
 *    from row 1 downwards.
 *
 *  - Follow the Coast wave mark: fitted to src/assets/waves-logo.png. Five
 *    stacked wave strokes, each 2.5 periods of a cubic-bezier wave whose
 *    control points meet at the midpoint of every half period. The fit
 *    reproduces the original artwork at IoU 0.989 with no pixel off by more
 *    than 100/255 of alpha.
 */

/* ---------------------------------------------------------------- Sierra -- */

export const SIERRA = {
  cols: 29,
  rows: 15,
  // Native artboard size in points, kept so cell proportions match the .ai file.
  width: 566.929,
  height: 293.386,
  apexCol: 14,
  apexRow: 1,
};
SIERRA.cellW = SIERRA.width / SIERRA.cols;
SIERRA.cellH = SIERRA.height / SIERRA.rows;

export const inTriangle = (row, col) =>
  row >= SIERRA.apexRow && Math.abs(col - SIERRA.apexCol) <= row;

export const isChecker = (row, col) => (row + col) % 2 === 0;

/** The checker cells that animate in — checkerboard minus the triangle. */
export function checkerCells() {
  const out = [];
  for (let r = 0; r < SIERRA.rows; r++)
    for (let c = 0; c < SIERRA.cols; c++)
      if (isChecker(r, c) && !inTriangle(r, c)) out.push({ r, c });
  return out;
}

/** The stepped pyramid as a single closed outline, walked clockwise. */
export function trianglePath() {
  const { cellW, cellH, apexCol, apexRow, rows } = SIERRA;
  const pts = [];
  // Down the right-hand staircase, apex to base.
  for (let r = apexRow; r < rows; r++) {
    pts.push([(apexCol + r + 1) * cellW, r * cellH]);
    pts.push([(apexCol + r + 1) * cellW, (r + 1) * cellH]);
  }
  // Back along the base, then up the left-hand staircase.
  for (let r = rows - 1; r >= apexRow; r--) {
    pts.push([(apexCol - r) * cellW, (r + 1) * cellH]);
    pts.push([(apexCol - r) * cellW, r * cellH]);
  }
  return 'M ' + pts.map(([x, y]) => `${x.toFixed(3)} ${y.toFixed(3)}`).join(' L ') + ' Z';
}

/* ------------------------------------------------------------------ Wave -- */

export const WAVE = {
  period: 187.5372,
  amplitude: 21.3948,
  stroke: 16.8972,
  pitch: 84.5667, // distance between the five wave centrelines
  periods: 2.5,
  count: 5,
};
WAVE.width = WAVE.period * WAVE.periods;
WAVE.height = WAVE.pitch * (WAVE.count - 1) + 2 * WAVE.amplitude + WAVE.stroke;

/**
 * One wave, drawn left to right starting on a crest. Each half period is a
 * cubic whose two control points sit on the half-period midpoint, which is the
 * construction the original artwork uses.
 */
export function wavePath(cy) {
  const { period, amplitude: A, periods } = WAVE;
  const half = period / 2;
  const x0 = 0;
  let d = `M ${x0} ${(cy - A).toFixed(3)}`;
  for (let i = 0; i < Math.round(periods * 2); i++) {
    const xs = x0 + i * half;
    const yA = cy + (i % 2 === 0 ? -A : A);
    const yB = cy + (i % 2 === 0 ? A : -A);
    const mid = (xs + half / 2).toFixed(3);
    d += ` C ${mid} ${yA.toFixed(3)} ${mid} ${yB.toFixed(3)} ${(xs + half).toFixed(3)} ${yB.toFixed(3)}`;
  }
  return d;
}

/** Centre-line y for wave `i`, in a box whose origin is the mark's bounding box. */
export const waveCY = (i) => WAVE.amplitude + WAVE.stroke / 2 + i * WAVE.pitch;

/** Arc length of one wave path — needed for stroke-dash draw-on. */
export function waveLength() {
  const { period, amplitude: A, periods } = WAVE;
  const half = period / 2;
  let len = 0;
  const N = 4000;
  let px = 0, py = -A;
  for (let i = 0; i < Math.round(periods * 2); i++) {
    const xs = i * half, mid = xs + half / 2;
    const yA = i % 2 === 0 ? -A : A;
    const yB = i % 2 === 0 ? A : -A;
    for (let k = 1; k <= N; k++) {
      const u = k / N, v = 1 - u;
      const x = v * v * v * xs + 3 * v * v * u * mid + 3 * v * u * u * mid + u * u * u * (xs + half);
      const y = v * v * v * yA + 3 * v * v * u * yA + 3 * v * u * u * yB + u * u * u * yB;
      len += Math.hypot(x - px, y - py);
      px = x; py = y;
    }
  }
  return len;
}
