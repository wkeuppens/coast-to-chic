/**
 * Follow The Coast — Stage Data Source
 * ─────────────────────────────────────
 * Single source of truth for all 168 stages.
 * Backend replaces this with: GET /api/gallery/tiles
 *
 * Coordinates simulate European coastline progression:
 *   Stages 001–040: Atlantic coast (Portugal → France) — westward, moving NE
 *   Stages 041–080: Bay of Biscay → Channel (France → Belgium) — curving N then E
 *   Stages 081–120: North Sea → Mediterranean entry (France south) — sweeping SE
 *   Stages 121–168: Mediterranean (Italy → Greece → Turkey) — eastward
 *
 * TILE SIZES cycle through presets to create visual variety.
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
  [420, 320],
  [480, 360],
  [400, 500],
  [520, 380],
  [380, 460],
  [440, 340],
  [460, 350],
  [400, 420],
];

/* ── Deterministic pseudo-random using seed ── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ── Generate coastline-like coordinates ── */
function generateCoastlineCoordinates(count: number): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];

  // Base direction vectors for four coastline segments
  const segments = [
    { startX: -2000, startY: 800,   dx: 90,  dy: -30, waveAmp: 120, wavePeriod: 12 }, // Atlantic S→N
    { startX: 1600,  startY: -400,  dx: 80,  dy: -20, waveAmp: 100, wavePeriod: 10 }, // Biscay → Channel
    { startX: 4800,  startY: -1200, dx: 70,  dy: 40,  waveAmp: 140, wavePeriod: 14 }, // Turn south
    { startX: 8000,  startY: 200,   dx: 85,  dy: 10,  waveAmp: 110, wavePeriod: 11 }, // Mediterranean east
  ];

  const perSegment = Math.ceil(count / segments.length);

  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    const stageCount = Math.min(perSegment, count - coords.length);

    for (let i = 0; i < stageCount; i++) {
      const globalIndex = coords.length;
      const progress = i / perSegment;
      const seed = globalIndex;

      // Base position along the coastline direction
      const baseX = seg.startX + i * seg.dx;
      const baseY = seg.startY + i * seg.dy;

      // Organic wave offset perpendicular to direction
      const wave = Math.sin((i / seg.wavePeriod) * Math.PI * 2) * seg.waveAmp;
      const waveX = wave * (seg.dy / Math.max(Math.abs(seg.dx) + Math.abs(seg.dy), 1));
      const waveY = wave * (seg.dx / Math.max(Math.abs(seg.dx) + Math.abs(seg.dy), 1));

      // Random jitter for organic feel
      const jitterX = (seededRandom(seed * 3 + 1) - 0.5) * 180;
      const jitterY = (seededRandom(seed * 3 + 2) - 0.5) * 180;

      coords.push({
        x: Math.round(baseX + waveX + jitterX),
        y: Math.round(baseY - waveY + jitterY),
      });
    }
  }

  return coords;
}

/* ── Build complete stages array ── */
function buildStages(count: number): StageTileData[] {
  const coords = generateCoastlineCoordinates(count);
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
