import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
          to="/archive"
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
        {galleryImages.map((image, index) => (
          <Link
            key={index}
            to={image.href}
            className="relative flex-shrink-0 w-[300px] md:w-[400px] lg:w-[500px] aspect-[3/2] overflow-hidden group block rounded-sm"
          >
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={image.src}
                alt={`${image.title} — ${image.location}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-display mb-1">
                  {image.title}
                </p>
                <span className="font-display text-sm text-white tracking-wide">
                  {image.location}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Mobile link */}
      <div className="md:hidden px-6 mt-8">
        <Link
          to="/archive"
          className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-display"
        >
          View all photos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
