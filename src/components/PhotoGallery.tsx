import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import coastalPath from '@/assets/coastal-path.jpg';
import cliffBay from '@/assets/cliff-bay.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';
import coastalFortress from '@/assets/coastal-fortress.jpg';
import coastalTown from '@/assets/coastal-town.jpg';

const images = [
  { src: coastalPath, alt: 'Coastal path, Biarritz', label: 'Stage 089' },
  { src: cliffBay, alt: 'Cliff bay, Sagres', label: 'Stage 031' },
  { src: harborBoats, alt: 'Harbor boats, Venice', label: 'Stage 156' },
  { src: sailboatSea, alt: 'Sailboat at sea, Amalfi', label: 'Stage 118' },
  { src: coastalFortress, alt: 'Coastal fortress, Saint-Malo', label: 'Stage 067' },
  { src: coastalTown, alt: 'Coastal town, Cinque Terre', label: 'Stage 142' },
];

/**
 * Horizontal scroll gallery — photographs glide past like turning pages.
 * Large, cinematic, no thumbnails.
 */
export const PhotoGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <section ref={containerRef} className="py-chapter overflow-hidden">
      {/* Header */}
      <div ref={headerRef} className="px-page mb-block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-content mx-auto flex items-end justify-between"
        >
          <div>
            <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Gallery</p>
            <h2 className="text-2xl md:text-3xl tracking-tight">Along the way</h2>
          </div>
          <Link
            to="/archive"
            className="hidden md:block text-caption text-muted-foreground hover:text-foreground transition-colors"
          >
            Full archive →
          </Link>
        </motion.div>
      </div>

      {/* Horizontal image strip */}
      <motion.div
        style={{ x }}
        className="flex gap-3 md:gap-4 pl-[var(--margin-page)]"
      >
        {images.map((img, i) => (
          <Link
            key={i}
            to="/archive"
            className="relative flex-shrink-0 w-[75vw] md:w-[45vw] lg:w-[38vw] overflow-hidden group block"
            style={{ aspectRatio: '3 / 2' }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
            />
            {/* Caption — appears on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-caption text-primary-foreground/70">{img.label}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Mobile link */}
      <div className="md:hidden px-page mt-6">
        <Link to="/archive" className="text-caption text-muted-foreground hover:text-foreground transition-colors">
          Full archive →
        </Link>
      </div>
    </section>
  );
};
