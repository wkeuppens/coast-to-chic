import { motion } from 'framer-motion';
import coastalTown from '@/assets/coastal-town.jpg';

/**
 * Hero — full-viewport photograph, nothing else.
 * Like the opening plate of a book. Title floats quietly at the bottom.
 */
export const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Full-bleed photograph */}
      <motion.img
        src={beachRunners}
        alt="Runners along the European coastline"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Subtle gradient at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Title block — quiet, bottom-aligned, like a book title page */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        >
          <h1 className="font-display text-primary-foreground text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-4">
            Follow
            <br />
            The Coast
          </h1>
          <p className="text-caption text-primary-foreground/60 max-w-md">
            All of Europe's coastline. Counter-clockwise. 100 km at a time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
