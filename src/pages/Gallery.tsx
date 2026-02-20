import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import cliffBay from '@/assets/cliff-bay.jpg';
import beachRunners from '@/assets/beach-runners.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';
import coastalFortress from '@/assets/coastal-fortress.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';
import coastalPath from '@/assets/coastal-path.jpg';
import coastalTown from '@/assets/coastal-town.jpg';

/* ── Stage gallery data (will become API-driven) ── */
interface StageGallery {
  id: string;
  stage: string;
  region: string;
  cover: string;
  photos: { src: string; alt: string }[];
  span: 'normal' | 'tall' | 'wide' | 'large';
}

const stages: StageGallery[] = [
  {
    id: 'algarve',
    stage: 'Stage 12',
    region: 'Algarve, Portugal',
    cover: cliffBay,
    span: 'large',
    photos: [
      { src: cliffBay, alt: 'Cliff bay with turquoise water' },
      { src: coastalPath, alt: 'Coastal path through Algarve cliffs' },
      { src: sailboatSea, alt: 'Sailboat off Algarve coast' },
    ],
  },
  {
    id: 'costa-brava',
    stage: 'Stage 18',
    region: 'Costa Brava, Spain',
    cover: coastalFortress,
    span: 'tall',
    photos: [
      { src: coastalFortress, alt: 'Medieval fortress on coast' },
      { src: coastalTown, alt: 'Coastal town at sunset' },
    ],
  },
  {
    id: 'cote-azur',
    stage: 'Stage 24',
    region: "Côte d'Azur, France",
    cover: harborBoats,
    span: 'normal',
    photos: [
      { src: harborBoats, alt: 'Fishing boats in harbor' },
      { src: sailboatSea, alt: 'Sailboat on calm Mediterranean' },
    ],
  },
  {
    id: 'amalfi',
    stage: 'Stage 31',
    region: 'Amalfi Coast, Italy',
    cover: coastalTown,
    span: 'wide',
    photos: [
      { src: coastalTown, alt: 'Amalfi coastal town' },
      { src: cliffBay, alt: 'Rocky bay beneath cliffs' },
      { src: harborBoats, alt: 'Italian fishing boats' },
    ],
  },
  {
    id: 'dalmatia',
    stage: 'Stage 38',
    region: 'Dalmatia, Croatia',
    cover: sailboatSea,
    span: 'normal',
    photos: [
      { src: sailboatSea, alt: 'Sailboat on the Adriatic' },
      { src: coastalFortress, alt: 'Dubrovnik walls' },
    ],
  },
  {
    id: 'basque-coast',
    stage: 'Stage 8',
    region: 'Basque Country, Spain',
    cover: beachRunners,
    span: 'tall',
    photos: [
      { src: beachRunners, alt: 'Runners on Basque beach' },
      { src: coastalPath, alt: 'Basque coastal trail' },
    ],
  },
  {
    id: 'sardinia',
    stage: 'Stage 28',
    region: 'Sardinia, Italy',
    cover: coastalPath,
    span: 'normal',
    photos: [
      { src: coastalPath, alt: 'Sardinian coastal trail' },
      { src: cliffBay, alt: 'Crystal bay in Sardinia' },
    ],
  },
];

/* ── Masonry item component ── */
const GalleryCard = ({
  stage,
  index,
  onOpen,
}: {
  stage: StageGallery;
  index: number;
  onOpen: () => void;
}) => {
  const spanClass = {
    normal: 'col-span-1 row-span-1',
    tall: 'col-span-1 row-span-2',
    wide: 'col-span-2 row-span-1',
    large: 'col-span-2 row-span-2',
  }[stage.span];

  return (
    <motion.button
      onClick={onOpen}
      className={`${spanClass} relative overflow-hidden group cursor-pointer text-left`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 0.985 }}
      aria-label={`Open ${stage.region} gallery`}
    >
      <img
        src={stage.cover}
        alt={stage.region}
        loading={index < 4 ? 'eager' : 'lazy'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-display">
          {stage.stage}
        </p>
        <h3 className="font-display text-lg md:text-xl text-white leading-tight">
          {stage.region}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-white/50 text-xs">
          <span>{stage.photos.length} photos</span>
        </div>
      </div>
      {/* Hover corner accent */}
      <motion.div
        className="absolute top-4 right-4 w-8 h-8 border border-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <ArrowLeft className="w-3 h-3 text-white rotate-[135deg]" />
      </motion.div>
    </motion.button>
  );
};

/* ── Lightbox ── */
const Lightbox = ({
  stage,
  initialIndex,
  onClose,
}: {
  stage: StageGallery;
  initialIndex: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(initialIndex);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % stage.photos.length),
    [stage.photos.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + stage.photos.length) % stage.photos.length),
    [stage.photos.length]
  );

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
          <p className="text-xs uppercase tracking-widest text-white/50 font-display">
            {stage.stage}
          </p>
          <p className="text-sm text-white/80 font-display">{stage.region}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 tabular-nums">
            {current + 1} / {stage.photos.length}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Photo */}
      <div
        className="relative w-full max-w-5xl aspect-[3/2] mx-auto px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={stage.photos[current].src}
            alt={stage.photos[current].alt}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>

        {/* Navigation arrows */}
        {stage.photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {stage.photos.map((photo, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            className={`w-16 h-10 overflow-hidden rounded transition-all duration-200 ${
              i === current
                ? 'ring-2 ring-white/80 opacity-100'
                : 'opacity-40 hover:opacity-70'
            }`}
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
  const [openStage, setOpenStage] = useState<StageGallery | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (openStage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openStage]);

  return (
    <main className="min-h-screen bg-foreground cursor-none">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-display"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="text-xs uppercase tracking-widest text-white/30 font-display">
          Gallery
        </span>
      </header>

      {/* Hero header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-6 md:px-12 lg:px-24">
        <motion.p
          className="text-xs uppercase tracking-widest text-white/40 mb-4 font-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Along the way
        </motion.p>
        <motion.h1
          className="font-display text-4xl md:text-6xl lg:text-7xl text-white font-medium leading-[0.95]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Every stage
          <br />
          tells a story.
        </motion.h1>
        <motion.p
          className="mt-6 text-white/40 max-w-md text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Scroll through the stages of Follow the Coast. Click any photo to explore the full gallery from that stretch of coastline.
        </motion.p>
      </section>

      {/* Masonry grid */}
      <section className="px-4 md:px-8 lg:px-12 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] lg:auto-rows-[300px] gap-3 md:gap-4">
          {stages.map((stage, i) => (
            <GalleryCard
              key={stage.id}
              stage={stage}
              index={i}
              onOpen={() => setOpenStage(stage)}
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {openStage && (
          <Lightbox
            stage={openStage}
            initialIndex={0}
            onClose={() => setOpenStage(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
