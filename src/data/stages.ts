/**
 * Follow The Coast — Stage Data Source
 * ─────────────────────────────────────
 * Single source of truth for all 168 stages.
 * Backend replaces this with: GET /api/gallery/tiles
 *
 * Layout: Loose grid spread across the canvas with organic jitter.
 * Tiles are placed in columns and rows with guaranteed gaps (no overlap).
 * Small random offsets create an editorial, non-mechanical feel.
 *
 * All coordinates are world-space pixels on the infinite canvas.
 */

export interface StageTileData {
  id: string;
  title: string;
  location: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  link: string;
}

/* ── Uniform 3:2 tile dimensions ── */
const TILE_W = 420;
const TILE_H = 280; // 3:2 aspect ratio

/* ── Structured grid layout (godly.website style) ── */
const COLS = 6;                 // tiles per row
const GAP_X = 24;               // horizontal gap between tiles
const GAP_Y = 24;               // vertical gap between tiles

function buildStages(count: number): StageTileData[] {
  const stages: StageTileData[] = [];
  const totalCols = COLS;
  const totalRows = Math.ceil(count / totalCols);

  // Total grid dimensions
  const gridW = totalCols * TILE_W + (totalCols - 1) * GAP_X;
  const gridH = totalRows * TILE_H + (totalRows - 1) * GAP_Y;

  // Center grid around origin
  const offsetX = -gridW / 2;
  const offsetY = -gridH / 2;

  for (let i = 0; i < count; i++) {
    const col = i % totalCols;
    const row = Math.floor(i / totalCols);
    const num = String(i + 1).padStart(3, '0');

    stages.push({
      id: `stage-${num}`,
      title: `Stage ${num}`,
      location: 'TBD',
      image: `/placeholders/stage-${num}.jpg`,
      x: offsetX + col * (TILE_W + GAP_X),
      y: offsetY + row * (TILE_H + GAP_Y),
      width: TILE_W,
      height: TILE_H,
      link: `/stages/stage-${num}`,
    });
  }

  return stages;
}

/**
 * All 168 stages with coastline-progression coordinates.
 * Replace with API response in production.
 */
export const STAGES: StageTileData[] = buildStages(168);

/** Grid bounds for clamping camera */
export function getGridBounds() {
  const totalCols = COLS;
  const totalRows = Math.ceil(168 / totalCols);
  const gridW = totalCols * TILE_W + (totalCols - 1) * GAP_X;
  const gridH = totalRows * TILE_H + (totalRows - 1) * GAP_Y;
  return {
    left: -gridW / 2,
    top: -gridH / 2,
    right: gridW / 2,
    bottom: gridH / 2,
    width: gridW,
    height: gridH,
  };
}

/**
 * Expected API response format:
 * ```json
 * {
 *   "stages": [
 *     {
 *       "id": "stage-001",
 *       "title": "Stage 001",
 *       "location": "Sagres, Portugal",
 *       "image": "https://cdn.followthecoast.com/stages/001/cover.jpg",
 *       "x": -2000,
 *       "y": 800,
 *       "width": 420,
 *       "height": 320,
 *       "link": "/stages/stage-001"
 *     }
 *   ]
 * }
 * ```
 */
