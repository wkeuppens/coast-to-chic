/**
 * Follow The Coast — Stage Data Source (Archive)
 * ─────────────────────────────────────────────────
 * Single source of truth for all 168 stages.
 * Backend replaces this with: GET /api/archive/tiles
 *
 * Layout: Structured 6-column grid centered on origin.
 * All coordinates are world-space pixels on the infinite canvas.
 */

export interface StageTileData {
  id: string;
  title: string;
  stageNumber: number;
  location: string;
  country: string;
  year: number;
  season: string;
  status: 'Completed' | 'Upcoming';
  shoreholder?: string;
  /** Start coordinate [lat, lng] — populated from database/CSV */
  startCoord?: [number, number];
  /** End coordinate [lat, lng] — populated from database/CSV */
  endCoord?: [number, number];
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  link: string;
}

/* ── Uniform 3:2 tile dimensions ── */
const TILE_W = 420;
const TILE_H = 280;

/* ── Structured grid layout ── */
const COLS = 6;
const GAP_X = 24;
const GAP_Y = 24;

/* ── Archival metadata generation ── */
const COUNTRIES = ['Portugal', 'Spain', 'France', 'Italy', 'Slovenia'];
const COUNTRY_RANGES: [number, number, string][] = [
  [1, 28, 'Portugal'],
  [29, 62, 'Spain'],
  [63, 110, 'France'],
  [111, 155, 'Italy'],
  [155, 168, 'Slovenia'],
];

const LOCATIONS: Record<string, string[]> = {
  Portugal: ['Sagres', 'Lagos', 'Faro', 'Tavira', 'Albufeira', 'Portimão', 'Sines', 'Setúbal', 'Cascais', 'Sintra', 'Ericeira', 'Peniche', 'Nazaré', 'Figueira da Foz', 'Aveiro', 'Porto', 'Viana do Castelo', 'Caminha'],
  Spain: ['Baiona', 'Vigo', 'Pontevedra', 'Muros', 'Finisterre', 'A Coruña', 'Ferrol', 'Viveiro', 'Ribadeo', 'Gijón', 'Santander', 'Bilbao', 'San Sebastián', 'Hondarribia', 'Roses', 'Cadaqués', 'Tossa de Mar', 'Barcelona', 'Tarragona', 'Valencia', 'Alicante', 'Cartagena', 'Almería', 'Málaga'],
  France: ['Hendaye', 'Biarritz', 'Capbreton', 'Arcachon', 'Royan', 'La Rochelle', 'Île de Ré', 'Les Sables-d\'Olonne', 'Saint-Nazaire', 'Carnac', 'Quiberon', 'Lorient', 'Concarneau', 'Douarnenez', 'Brest', 'Roscoff', 'Perros-Guirec', 'Saint-Malo', 'Cancale', 'Mont-Saint-Michel', 'Granville', 'Cherbourg', 'Deauville', 'Étretat', 'Dieppe', 'Le Touquet', 'Calais', 'Dunkirk', 'Nice', 'Cannes', 'Marseille', 'Montpellier', 'Sète', 'Perpignan'],
  Italy: ['Ventimiglia', 'Sanremo', 'Genoa', 'Cinque Terre', 'La Spezia', 'Viareggio', 'Livorno', 'Piombino', 'Orbetello', 'Civitavecchia', 'Ostia', 'Anzio', 'Gaeta', 'Naples', 'Amalfi', 'Salerno', 'Paola', 'Tropea', 'Reggio Calabria', 'Taranto', 'Bari', 'Vieste', 'Pescara', 'Ancona', 'Rimini', 'Ravenna', 'Venice', 'Trieste'],
  Slovenia: ['Koper', 'Izola', 'Piran', 'Portorož'],
};

const FIRST_NAMES = ['Ana', 'Marco', 'Luís', 'Elena', 'Pierre', 'Sofia', 'Jan', 'Clara', 'Diogo', 'Marie', 'Luca', 'Ingrid', 'Hugo', 'Katja', 'Tomás', 'Maren', 'Emil', 'Elisa', 'Nils', 'Sara'];
const LAST_NAMES = ['Ferreira', 'Moretti', 'Dupont', 'García', 'Novak', 'Lindström', 'Schneider', 'Costa', 'Peeters', 'Russo', 'Johansson', 'Müller', 'Almeida', 'Bernard', 'Van Dijk'];

/** Deterministic pseudo-random from seed */
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function getCountry(stageNum: number): string {
  for (const [start, end, country] of COUNTRY_RANGES) {
    if (stageNum >= start && stageNum <= end) return country;
  }
  return 'Portugal';
}

function getLocation(stageNum: number, country: string): string {
  const locs = LOCATIONS[country] || ['TBD'];
  return locs[stageNum % locs.length];
}

function getShoreholder(stageNum: number): string {
  const first = FIRST_NAMES[stageNum % FIRST_NAMES.length];
  const last = LAST_NAMES[(stageNum * 7) % LAST_NAMES.length];
  return `${first} ${last}`;
}

function getYear(stageNum: number): number {
  if (stageNum <= 30) return 2019;
  if (stageNum <= 55) return 2020;
  if (stageNum <= 75) return 2021;
  if (stageNum <= 95) return 2022;
  if (stageNum <= 120) return 2023;
  if (stageNum <= 145) return 2024;
  if (stageNum <= 168) return 2025;
  return 2026;
}

function getSeason(stageNum: number): string {
  const r = seededRand(stageNum);
  if (r < 0.25) return 'Spring';
  if (r < 0.5) return 'Summer';
  if (r < 0.75) return 'Autumn';
  return 'Winter';
}

const COMPLETED_THRESHOLD = 168; // all 168 stages are completed (stage 169 starts April 2026)

function buildStages(count: number): StageTileData[] {
  const stages: StageTileData[] = [];
  const totalRows = Math.ceil(count / COLS);
  const gridW = COLS * TILE_W + (COLS - 1) * GAP_X;
  const gridH = totalRows * TILE_H + (totalRows - 1) * GAP_Y;
  const offsetX = -gridW / 2;
  const offsetY = -gridH / 2;

  for (let i = 0; i < count; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const num = i + 1;
    const numStr = String(num).padStart(3, '0');
    const country = getCountry(num);

    stages.push({
      id: `stage-${numStr}`,
      title: `Stage ${numStr}`,
      stageNumber: num,
      location: getLocation(num, country),
      country,
      year: getYear(num),
      season: getSeason(num),
      status: num <= COMPLETED_THRESHOLD ? 'Completed' : 'Upcoming',
      shoreholder: num <= COMPLETED_THRESHOLD ? getShoreholder(num) : undefined,
      image: `/placeholders/stage-${numStr}.jpg`,
      x: offsetX + col * (TILE_W + GAP_X),
      y: offsetY + row * (TILE_H + GAP_Y),
      width: TILE_W,
      height: TILE_H,
      link: `/stages/stage-${numStr}`,
    });
  }

  return stages;
}

export const STAGES: StageTileData[] = buildStages(168);

/** Unique countries from data */
export const ARCHIVE_COUNTRIES = [...new Set(STAGES.map(s => s.country))];

/** Unique years from data */
export const ARCHIVE_YEARS = [...new Set(STAGES.map(s => s.year))].sort();

/** Grid bounds for clamping camera */
export function getGridBounds() {
  const totalRows = Math.ceil(168 / COLS);
  const gridW = COLS * TILE_W + (COLS - 1) * GAP_X;
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
