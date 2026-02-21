import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Move } from 'lucide-react';
import { useCanvasCamera } from '@/hooks/useCanvasCamera';
import GalleryTile, { type StageTile } from '@/components/GalleryTile';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Stage images (will become API-driven) ──
import cliffBay from '@/assets/cliff-bay.jpg';
import beachRunners from '@/assets/beach-runners.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';
import coastalFortress from '@/assets/coastal-fortress.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';
import coastalPath from '@/assets/coastal-path.jpg';
import coastalTown from '@/assets/coastal-town.jpg';

/* ──────────────────────────────────────────────
   TILE DATA — replace with API fetch
   Coordinates are in world-space pixels.
   ────────────────────────────────────────────── */
const STAGE_TILES: StageTile[] = [
  { id: 'algarve',       title: 'Stage 12', region: 'Algarve, Portugal',      image: cliffBay,         x: 0,    y: 0,     width: 520, height: 380, link: '/gallery' },
  { id: 'costa-brava',   title: 'Stage 18', region: 'Costa Brava, Spain',     image: coastalFortress,  x: 620,  y: -80,   width: 400, height: 500, link: '/gallery' },
  { id: 'cote-azur',     title: 'Stage 24', region: "Côte d'Azur, France",    image: harborBoats,      x: 1120, y: 60,    width: 440, height: 340, link: '/gallery' },
  { id: 'amalfi',        title: 'Stage 31', region: 'Amalfi Coast, Italy',    image: coastalTown,      x: 200,  y: 480,   width: 560, height: 360, link: '/gallery' },
  { id: 'dalmatia',      title: 'Stage 38', region: 'Dalmatia, Croatia',      image: sailboatSea,      x: 860,  y: 520,   width: 400, height: 420, link: '/gallery' },
  { id: 'basque',        title: 'Stage 8',  region: 'Basque Country, Spain',  image: beachRunners,     x: -480, y: 240,   width: 420, height: 340, link: '/gallery' },
  { id: 'sardinia',      title: 'Stage 28', region: 'Sardinia, Italy',        image: coastalPath,      x: 1360, y: 440,   width: 380, height: 460, link: '/gallery' },
  { id: 'alentejo',      title: 'Stage 10', region: 'Alentejo, Portugal',     image: sailboatSea,      x: -340, y: -200,  width: 360, height: 300, link: '/gallery' },
  { id: 'cinque-terre',  title: 'Stage 26', region: 'Cinque Terre, Italy',    image: harborBoats,      x: 1600, y: -120,  width: 440, height: 380, link: '/gallery' },
  { id: 'normandy',      title: 'Stage 3',  region: 'Normandy, France',       image: cliffBay,         x: -600, y: -350,  width: 480, height: 320, link: '/gallery' },
  { id: 'brittany',      title: 'Stage 5',  region: 'Brittany, France',       image: coastalFortress,  x: -100, y: -420,  width: 400, height: 340, link: '/gallery' },
  { id: 'cantabria',     title: 'Stage 7',  region: 'Cantabria, Spain',       image: coastalPath,      x: 400,  y: -480,  width: 460, height: 360, link: '/gallery' },
  { id: 'ligurian',      title: 'Stage 22', region: 'Ligurian Coast, Italy',  image: coastalTown,      x: 1400, y: 880,   width: 420, height: 340, link: '/gallery' },
  { id: 'peloponnese',   title: 'Stage 42', region: 'Peloponnese, Greece',    image: beachRunners,     x: 800,  y: 960,   width: 500, height: 380, link: '/gallery' },
];

// ── Stage photos for lightbox (will become API-driven) ──
interface StagePhotos {
  stage: string;
  region: string;
  photos: { src: string; alt: string }[];
}

const STAGE_PHOTOS: Record<string, StagePhotos> = {
  algarve:      { stage: 'Stage 12', region: 'Algarve, Portugal',     photos: [{ src: cliffBay, alt: 'Cliff bay' }, { src: coastalPath, alt: 'Coastal path' }, { src: sailboatSea, alt: 'Sailboat' }] },
  'costa-brava': { stage: 'Stage 18', region: 'Costa Brava, Spain',    photos: [{ src: coastalFortress, alt: 'Fortress' }, { src: coastalTown, alt: 'Town' }] },
  'cote-azur':  { stage: 'Stage 24', region: "Côte d'Azur, France",   photos: [{ src: harborBoats, alt: 'Harbor' }, { src: sailboatSea, alt: 'Sailboat' }] },
  amalfi:       { stage: 'Stage 31', region: 'Amalfi Coast, Italy',   photos: [{ src: coastalTown, alt: 'Amalfi town' }, { src: cliffBay, alt: 'Bay' }, { src: harborBoats, alt: 'Boats' }] },
  dalmatia:     { stage: 'Stage 38', region: 'Dalmatia, Croatia',     photos: [{ src: sailboatSea, alt: 'Adriatic' }, { src: coastalFortress, alt: 'Walls' }] },
  basque:       { stage: 'Stage 8',  region: 'Basque Country, Spain', photos: [{ src: beachRunners, alt: 'Beach runners' }, { src: coastalPath, alt: 'Trail' }] },
  sardinia:     { stage: 'Stage 28', region: 'Sardinia, Italy',       photos: [{ src: coastalPath, alt: 'Sardinian trail' }, { src: cliffBay, alt: 'Crystal bay' }] },
  alentejo:     { stage: 'Stage 10', region: 'Alentejo, Portugal',    photos: [{ src: sailboatSea, alt: 'Sailboat' }] },
  'cinque-terre': { stage: 'Stage 26', region: 'Cinque Terre, Italy',  photos: [{ src: harborBoats, alt: 'Harbor' }, { src: coastalTown, alt: 'Village' }] },
  normandy:     { stage: 'Stage 3',  region: 'Normandy, France',      photos: [{ src: cliffBay, alt: 'Cliffs' }] },
  brittany:     { stage: 'Stage 5',  region: 'Brittany, France',      photos: [{ src: coastalFortress, alt: 'Fortress' }] },
  cantabria:    { stage: 'Stage 7',  region: 'Cantabria, Spain',      photos: [{ src: coastalPath, alt: 'Coastal path' }] },
  ligurian:     { stage: 'Stage 22', region: 'Ligurian Coast, Italy', photos: [{ src: coastalTown, alt: 'Coast' }] },
  peloponnese:  { stage: 'Stage 42', region: 'Peloponnese, Greece',   photos: [{ src: beachRunners, alt: 'Beach' }] },
};

const BUFFER = 300; // px buffer around viewport for virtualization

/* ── Lightbox ── */
const Lightbox = ({
  data,
  onClose,
}: {
  data: StagePhotos;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % data.photos.length), [data.photos.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + data.photos.length) % data.photos.length), [data.photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, next, prev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-display">{data.stage}</p>
          <p className="text-sm text-white/80 font-display">{data.region}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 tabular-nums">{current + 1} / {data.photos.length}</span>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Close gallery">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Photo */}
      <div className="relative w-full max-w-5xl aspect-[3/2] mx-auto px-4" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={data.photos[current].src}
            alt={data.photos[current].alt}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>
        {data.photos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Next photo">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {data.photos.map((photo, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-16 h-10 overflow-hidden rounded transition-all duration-200 ${i === current ? 'ring-2 ring-white/80 opacity-100' : 'opacity-40 hover:opacity-70'}`}
            aria-label={`View photo ${i + 1}`}
          >
            <img src={photo.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

/* ── Gallery page ── */
const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { camera } = useCanvasCamera(containerRef);
  const [lightbox, setLightbox] = useState<StagePhotos | null>(null);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });
  const [showHint, setShowHint] = useState(true);
  const dragDistance = useRef(0);
  const pointerStart = useRef({ x: 0, y: 0 });

  // Track viewport size
  useEffect(() => {
    const update = () => setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Hide hint after first interaction
  useEffect(() => {
    if (camera.x !== 0 || camera.y !== 0) setShowHint(false);
  }, [camera.x, camera.y]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Lightbox body scroll lock
  useEffect(() => {
    if (lightbox) document.body.style.overflow = 'hidden';
  }, [lightbox]);

  // ── Virtualization: only render tiles within viewport + buffer ──
  const visibleTiles = useMemo(() => {
    if (!viewportSize.w) return STAGE_TILES;
    const vLeft = -camera.x / camera.zoom - BUFFER;
    const vTop = -camera.y / camera.zoom - BUFFER;
    const vRight = vLeft + viewportSize.w / camera.zoom + BUFFER * 2;
    const vBottom = vTop + viewportSize.h / camera.zoom + BUFFER * 2;

    return STAGE_TILES.filter((t) => {
      const tRight = t.x + t.width;
      const tBottom = t.y + t.height;
      return tRight > vLeft && t.x < vRight && tBottom > vTop && t.y < vBottom;
    });
  }, [camera.x, camera.y, camera.zoom, viewportSize]);

  // Track drag distance to distinguish click from drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragDistance.current = 0;
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMoveCapture = useCallback((e: React.PointerEvent) => {
    dragDistance.current = Math.max(
      dragDistance.current,
      Math.abs(e.clientX - pointerStart.current.x) + Math.abs(e.clientY - pointerStart.current.y)
    );
  }, []);

  const handleTileClick = useCallback((tile: StageTile) => {
    // Only open lightbox if the user didn't drag
    if (dragDistance.current > 6) return;
    const photos = STAGE_PHOTOS[tile.id];
    if (photos) setLightbox(photos);
  }, []);

  return (
    <main className="fixed inset-0 bg-foreground overflow-hidden touch-none" style={{ cursor: 'grab' }}>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-display"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="text-xs uppercase tracking-widest text-white/30 font-display">
          Gallery
        </span>
      </header>

      {/* Interaction hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
          >
            <Move className="w-4 h-4 text-white/60" />
            <span className="text-xs text-white/60 font-display tracking-wide">
              Drag to explore · Scroll to pan · Pinch to zoom
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom indicator */}
      {camera.zoom !== 1 && (
        <div className="fixed bottom-8 right-8 z-40 text-[10px] text-white/30 font-display tabular-nums">
          {Math.round(camera.zoom * 100)}%
        </div>
      )}

      {/* Canvas viewport */}
      <div
        ref={containerRef}
        className="w-full h-full"
        onPointerDown={onPointerDown}
        onPointerMoveCapture={onPointerMoveCapture}
        style={{ touchAction: 'none' }}
      >
        {/* World layer — GPU composited */}
        <div
          className="will-change-transform"
          style={{
            transform: `translate3d(${camera.x + viewportSize.w / 2}px, ${camera.y + viewportSize.h / 2}px, 0) scale(${camera.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {visibleTiles.map((tile) => (
            <GalleryTile key={tile.id} tile={tile} onClick={handleTileClick} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && <Lightbox data={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
