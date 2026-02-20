import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import cliffBay from '@/assets/cliff-bay.jpg';
import beachRunners from '@/assets/beach-runners.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';
import coastalFortress from '@/assets/coastal-fortress.jpg';
import sailboatSea from '@/assets/sailboat-sea.jpg';

const photos = [
  { src: cliffBay, alt: 'Cliff bay with boats' },
  { src: beachRunners, alt: 'Runners on beach' },
  { src: harborBoats, alt: 'Harbor with fishing boats' },
  { src: coastalFortress, alt: 'Coastal fortress' },
  { src: sailboatSea, alt: 'Sailboat on calm sea' },
];

export const PhotoGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <section ref={containerRef} className="py-24 md:py-32 overflow-hidden bg-background">
      <div className="px-6 md:px-12 lg:px-24 mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground tracking-wide mb-4">Gallery</p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground">
            Along the way.
          </h2>
        </div>
        <Link
          to="/gallery"
          className="hidden md:flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-display group"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <motion.div
        style={{ x }}
        className="flex gap-6 pl-6 md:pl-12 lg:pl-24"
      >
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            className="relative flex-shrink-0 w-[300px] md:w-[400px] lg:w-[500px] aspect-[4/3] overflow-hidden group"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile link */}
      <div className="md:hidden px-6 mt-8">
        <Link
          to="/gallery"
          className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-display"
        >
          View all photos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
