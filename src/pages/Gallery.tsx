import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ArrowLeft, Move } from 'lucide-react';
import { useCanvasCamera } from '@/hooks/useCanvasCamera';
import GalleryTile from '@/components/GalleryTile';
import { STAGES, getGridBounds, type StageTileData } from '@/data/stages';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const BUFFER = 400; // px buffer around viewport for virtualization

/* ── Lightbox (stage photos — will become API-driven) ── */
interface StagePhotos {
  stage: string;
  location: string;
  photos: { src: string; alt: string }[];
}

/**
 * Generates placeholder lightbox data from a tile.
 * Backend replaces this with: GET /api/stages/:id/photos
 */
function getStagePhotos(tile: StageTileData): StagePhotos {
  return {
    stage: tile.title,
    location: tile.location,
    photos: [{ src: tile.image, alt: tile.location }],
  };
}

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
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-display">{data.stage}</p>
          <p className="text-sm text-white/80 font-display">{data.location}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 tabular-nums">{current + 1} / {data.photos.length}</span>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Close gallery">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

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

      {data.photos.length > 1 && (
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
      )}
    </motion.div>
  );
};

/* ── Gallery Canvas Page ── */
const GRID_BOUNDS = getGridBounds();
const PADDING = 40; // px padding around grid edges
const CLAMPED_BOUNDS = {
  left: GRID_BOUNDS.left - PADDING,
  top: GRID_BOUNDS.top - PADDING,
  right: GRID_BOUNDS.right + PADDING,
  bottom: GRID_BOUNDS.bottom + PADDING,
};

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { camera } = useCanvasCamera(containerRef, CLAMPED_BOUNDS);
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

  // ── Virtualization: only render tiles within viewport + buffer ──
  const visibleTiles = useMemo(() => {
    if (!viewportSize.w) return [];
    // Camera offset with centering applied
    const offsetX = camera.x + viewportSize.w / 2;
    const offsetY = camera.y + viewportSize.h / 2;

    const vLeft = -offsetX / camera.zoom - BUFFER;
    const vTop = -offsetY / camera.zoom - BUFFER;
    const vRight = vLeft + viewportSize.w / camera.zoom + BUFFER * 2;
    const vBottom = vTop + viewportSize.h / camera.zoom + BUFFER * 2;

    return STAGES.filter((t) => {
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

  const handleTileClick = useCallback((tile: StageTileData) => {
    if (dragDistance.current > 6) return;
    setLightbox(getStagePhotos(tile));
  }, []);

  return (
    <main className="fixed inset-0 bg-foreground overflow-hidden touch-none" style={{ cursor: 'grab' }}>
      <SEO title="Gallery" description="Explore the Follow the Coast stage gallery. 168 stages across the European coastline." path="/gallery" />
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
