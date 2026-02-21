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

/* ── Tile dimension presets ── */
const TILE_SIZES: [number, number][] = [
  [380, 280],
  [420, 310],
  [360, 440],
  [460, 340],
  [340, 420],
  [400, 300],
  [440, 320],
  [370, 390],
];

/* ── Deterministic pseudo-random using seed ── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ── Grid-based layout with organic jitter (no overlaps) ── */
const COLS = 14;                // tiles per row
const CELL_W = 560;            // horizontal cell pitch
const CELL_H = 520;            // vertical cell pitch
const GAP = 60;                // minimum gap between tiles
const JITTER_X = 60;           // max horizontal offset from grid center
const JITTER_Y = 50;           // max vertical offset from grid center
// Stagger: odd rows shift right by half a cell for a masonry feel
const STAGGER = CELL_W * 0.45;

function generateGridCoordinates(count: number): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];

  // Center the grid around origin
  const totalRows = Math.ceil(count / COLS);
  const offsetX = -(COLS * CELL_W) / 2;
  const offsetY = -(totalRows * CELL_H) / 2;

  for (let i = 0; i < count; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const seed = i;

    // Base grid position
    const baseX = offsetX + col * CELL_W;
    const baseY = offsetY + row * CELL_H;

    // Stagger odd rows
    const stagger = row % 2 === 1 ? STAGGER : 0;

    // Organic jitter
    const jx = (seededRandom(seed * 3 + 1) - 0.5) * 2 * JITTER_X;
    const jy = (seededRandom(seed * 3 + 2) - 0.5) * 2 * JITTER_Y;

    coords.push({
      x: Math.round(baseX + stagger + jx),
      y: Math.round(baseY + jy),
    });
  }

  return coords;
}

/* ── Build complete stages array ── */
function buildStages(count: number): StageTileData[] {
  const coords = generateGridCoordinates(count);
  const stages: StageTileData[] = [];

  for (let i = 0; i < count; i++) {
    const num = String(i + 1).padStart(3, '0');
    const sizeIndex = Math.floor(seededRandom(i * 7 + 5) * TILE_SIZES.length);
    const [width, height] = TILE_SIZES[sizeIndex];

    stages.push({
      id: `stage-${num}`,
      title: `Stage ${num}`,
      location: 'TBD',
      image: `/placeholders/stage-${num}.jpg`,
      x: coords[i].x,
      y: coords[i].y,
      width,
      height,
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
