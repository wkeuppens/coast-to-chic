import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EditorialArrow } from './EditorialArrow';
import coastalTown from '@/assets/coastal-town.jpg';
import coastalPath from '@/assets/coastal-path.jpg';
import cliffBay from '@/assets/cliff-bay.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';
import coastalFortress from '@/assets/coastal-fortress.jpg';

const galleryImages = [
  { src: coastalTown, title: 'Stage 142', location: 'Cinque Terre', href: '/archive' },
  { src: coastalPath, title: 'Stage 089', location: 'Biarritz', href: '/archive' },
  { src: cliffBay, title: 'Stage 031', location: 'Sagres', href: '/archive' },
  { src: harborBoats, title: 'Stage 156', location: 'Venice', href: '/archive' },
  { src: sailboatSea, title: 'Stage 118', location: 'Amalfi', href: '/archive' },
  { src: coastalFortress, title: 'Stage 067', location: 'Saint-Malo', href: '/archive' },
];

export const PhotoGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <section ref={containerRef} className="py-32 md:py-48 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-16 mb-10">
        <div className="max-w-6xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-caption text-muted-foreground mb-4">
              <EditorialArrow size={12} className="mr-2 opacity-40" />
              Gallery
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Along the way.
            </h2>
          </div>
          <Link
            to="/archive"
            className="hidden md:block text-caption text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* Horizontal scroll strip — full-bleed photos like book photo spreads */}
      <motion.div
        style={{ x }}
        className="flex gap-4 pl-6 md:pl-12 lg:pl-16"
      >
        {galleryImages.map((image, index) => (
          <Link
            key={index}
            to={image.href}
            className="relative flex-shrink-0 w-[320px] md:w-[440px] lg:w-[540px] aspect-[3/2] overflow-hidden group block"
          >
            <img
              src={image.src}
              alt={`${image.title} — ${image.location}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Caption overlay — book style: small tracked text in corner */}
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-caption text-background/70">
                {image.title} — {image.location}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Mobile link */}
      <div className="md:hidden px-6 mt-8">
        <Link
          to="/archive"
          className="text-caption text-muted-foreground hover:text-foreground transition-colors"
        >
          View all photos →
        </Link>
      </div>
    </section>
  );
};
