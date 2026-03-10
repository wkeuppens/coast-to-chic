import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ArrowLeft, Move } from 'lucide-react';
import { useCanvasCamera } from '@/hooks/useCanvasCamera';
import GalleryTile from '@/components/GalleryTile';
import { STAGES, ARCHIVE_COUNTRIES, ARCHIVE_YEARS, getGridBounds, type StageTileData } from '@/data/stages';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const BUFFER = 400;

/* ── Lightbox ── */
interface StagePhotos {
  stage: string;
  location: string;
  photos: { src: string; alt: string }[];
}

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
          <p className="text-xs uppercase tracking-widest text-white/50">{data.stage}</p>
          <p className="text-sm text-white/80">{data.location}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 tabular-nums">{current + 1} / {data.photos.length}</span>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Close">
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

/* ── Archive filters (collapsible dropdown) ── */
const ArchiveFilters = ({
  country,
  year,
  onCountry,
  onYear,
}: {
  country: string;
  year: string;
  onCountry: (v: string) => void;
  onYear: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const hasFilters = country !== 'All' || year !== 'All';

  const btnClass = (active: boolean) =>
    `text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors duration-200 ${
      active ? 'bg-white/15 text-white/90' : 'text-white/40 hover:text-white/60'
    }`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-[11px] font-display uppercase tracking-wider px-4 py-2 rounded-full border border-white/15 text-white/60 hover:text-white/80 hover:border-white/25 transition-colors"
      >
        Filter
        {hasFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 p-4 rounded-lg bg-primary/95 backdrop-blur-md border border-white/10 z-50 min-w-[280px] shadow-xl"
          >
            {/* Country */}
            <p className="text-[10px] text-white/30 font-display uppercase tracking-wider mb-2">Country</p>
            <div className="flex flex-wrap gap-1 mb-4">
              <button className={btnClass(country === 'All')} onClick={() => onCountry('All')}>All</button>
              {ARCHIVE_COUNTRIES.map(c => (
                <button key={c} className={btnClass(country === c)} onClick={() => onCountry(c)}>{c}</button>
              ))}
            </div>

            {/* Year */}
            <p className="text-[10px] text-white/30 font-display uppercase tracking-wider mb-2">Year</p>
            <div className="flex flex-wrap gap-1">
              <button className={btnClass(year === 'All')} onClick={() => onYear('All')}>All</button>
              {ARCHIVE_YEARS.map(y => (
                <button key={y} className={btnClass(year === String(y))} onClick={() => onYear(String(y))}>{y}</button>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={() => { onCountry('All'); onYear('All'); }}
                className="mt-3 text-[10px] text-white/30 hover:text-white/50 font-display uppercase tracking-wider transition-colors"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Archive Canvas Page ── */
const GRID_BOUNDS = getGridBounds();
const PADDING = 40;
const CLAMPED_BOUNDS = {
  left: GRID_BOUNDS.left - PADDING,
  top: GRID_BOUNDS.top - PADDING,
  right: GRID_BOUNDS.right + PADDING,
  bottom: GRID_BOUNDS.bottom + PADDING,
};

const Archive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { camera, setCamera } = useCanvasCamera(containerRef, CLAMPED_BOUNDS);
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightbox, setLightbox] = useState<StagePhotos | null>(null);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });
  const [showHint, setShowHint] = useState(true);
  const [showIntro, setShowIntro] = useState(!searchParams.get('stage'));
  const dragDistance = useRef(0);
  const pointerStart = useRef({ x: 0, y: 0 });
  const hasHandledDeepLink = useRef(false);

  // Filters
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  // Only show completed stages in the archive
  const completedStages = useMemo(() => STAGES.filter(s => s.status === 'Completed'), []);

  const filteredStages = useMemo(() => {
    return completedStages.filter(s => {
      if (filterCountry !== 'All' && s.country !== filterCountry) return false;
      if (filterYear !== 'All' && String(s.year) !== filterYear) return false;
      return true;
    });
  }, [filterCountry, filterYear, completedStages]);

  const hasFilters = filterCountry !== 'All' || filterYear !== 'All';

  useEffect(() => {
    const update = () => setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Deep-link: center on a specific stage and open its lightbox
  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (!stageParam || hasHandledDeepLink.current || !viewportSize.w) return;
    const stageNum = parseInt(stageParam, 10);
    const tile = completedStages.find(s => s.stageNumber === stageNum);
    if (!tile) return;
    hasHandledDeepLink.current = true;

    // Center camera on tile
    const tileCenterX = tile.x + tile.width / 2;
    const tileCenterY = tile.y + tile.height / 2;
    setCamera(c => ({
      ...c,
      x: -tileCenterX * c.zoom,
      y: -tileCenterY * c.zoom,
    }));

    // Open lightbox & clear param
    setLightbox(getStagePhotos(tile));
    setShowIntro(false);
    setShowHint(false);
    setSearchParams({}, { replace: true });
  }, [searchParams, viewportSize.w, completedStages, setCamera, setSearchParams]);

  useEffect(() => {
    if (camera.x !== 0 || camera.y !== 0) {
      setShowHint(false);
      setShowIntro(false);
    }
  }, [camera.x, camera.y]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const filteredSet = useMemo(() => new Set(filteredStages.map(s => s.id)), [filteredStages]);

  const visibleTiles = useMemo(() => {
    if (!viewportSize.w) return [];
    const offsetX = camera.x + viewportSize.w / 2;
    const offsetY = camera.y + viewportSize.h / 2;
    const vLeft = -offsetX / camera.zoom - BUFFER;
    const vTop = -offsetY / camera.zoom - BUFFER;
    const vRight = vLeft + viewportSize.w / camera.zoom + BUFFER * 2;
    const vBottom = vTop + viewportSize.h / camera.zoom + BUFFER * 2;

    return completedStages.filter((t) => {
      const tRight = t.x + t.width;
      const tBottom = t.y + t.height;
      return tRight > vLeft && t.x < vRight && tBottom > vTop && t.y < vBottom;
    });
  }, [camera.x, camera.y, camera.zoom, viewportSize, completedStages]);

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
    <main className="fixed inset-0 bg-primary overflow-hidden touch-none" style={{ cursor: 'grab' }}>
      <SEO
        title="Coastal Archive"
        description="A living archive documenting Europe's coastline stage by stage."
        path="/archive"
      />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-display"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs uppercase tracking-widest text-white/30 font-display">
          Coastal Archive
        </span>
      </header>

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-30 flex items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowIntro(false)}
          >
            <div className="max-w-xl px-8 text-center" onClick={(e) => e.stopPropagation()}>
              <h1 className="font-display text-3xl md:text-4xl text-white mb-6 uppercase tracking-wider">
                Coastal Archive
              </h1>
              <p className="text-sm md:text-base text-white/60 leading-relaxed mb-4 font-display">
                Follow the Coast is built stage by stage, over years.
              </p>
              <p className="text-sm md:text-base text-white/50 leading-relaxed mb-4">
                This archive gathers each stretch of coastline as it is carried forward, and the people who carried it.
              </p>
              <p className="text-sm text-white/40 leading-relaxed mb-8">
                Explore freely. Each tile marks a real passage along Europe's shore.
              </p>

              {/* Primary CTA */}
              <button
                onClick={() => setShowIntro(false)}
                className="pointer-events-auto mb-8 px-8 py-3 border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition-colors font-display uppercase tracking-wider"
              >
                Explore the Gallery
              </button>

              {/* Sub-page links */}
              <div className="flex items-center justify-center gap-6 pointer-events-auto">
                <Link
                  to="/route-map"
                  className="hidden md:inline text-[11px] text-white/30 hover:text-white/50 transition-colors font-display uppercase tracking-wider"
                >
                  Route Map
                </Link>
                <span className="text-white/15 hidden md:inline">·</span>
                <Link
                  to="/shoreholders"
                  className="text-[11px] text-white/30 hover:text-white/50 transition-colors font-display uppercase tracking-wider"
                >
                  Shoreholders
                </Link>
                <span className="text-white/15">·</span>
                <Link
                  to="/timeline"
                  className="text-[11px] text-white/30 hover:text-white/50 transition-colors font-display uppercase tracking-wider"
                >
                  Timeline
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters bar */}
      <div className="fixed top-20 left-6 md:left-12 z-40 pointer-events-auto flex items-center gap-3">
        <ArchiveFilters
          country={filterCountry}
          year={filterYear}
          onCountry={setFilterCountry}
          onYear={setFilterYear}
        />
        {hasFilters && (
          <span className="text-[10px] text-white/30 font-display tabular-nums">
            {filteredStages.length} / {completedStages.length}
          </span>
        )}
      </div>

      {/* Interaction hint */}
      <AnimatePresence>
        {showHint && !showIntro && (
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
            <div
              key={tile.id}
              style={{
                opacity: hasFilters && !filteredSet.has(tile.id) ? 0.15 : 1,
                transition: 'opacity 0.4s ease',
              }}
            >
              <GalleryTile tile={tile} onClick={handleTileClick} />
            </div>
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

export default Archive;
