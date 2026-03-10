import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import coastalTown from '@/assets/coastal-town.jpg';

/**
 * Hero — full-viewport photograph with title and pill CTA.
 * Like the opening plate of a book.
 */
export const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Full-bleed photograph */}
      <motion.img
        src={coastalTown}
        alt="Coastal town along the route"
        className="absolute inset-0 w-full h-full object-cover object-[30%_center] md:object-[40%_center] lg:object-center"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Title block — bottom-right aligned */}
      <div className="absolute inset-0 flex flex-col justify-end items-end p-8 md:p-12 lg:p-16 text-right">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-end"
        >
          <h1 className="font-display text-primary-foreground text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.9] mb-4">
            Follow
            <br />
            The Coast
          </h1>
          <p className="text-caption text-primary-foreground/60 max-w-md mb-8">
            All of Europe's coastline. Counter-clockwise. 100 km at a time.
            <span className="inline-block w-3 h-px bg-accent ml-2 align-middle" />
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <MagneticButton
              href="/register"
              className="inline-flex items-center justify-center bg-accent text-accent-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Register
            </MagneticButton>
            <MagneticButton
              href="#newsletter"
              className="inline-flex items-center justify-center border border-primary-foreground/40 text-primary-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:border-primary-foreground/70 transition-colors"
            >
              Newsletter
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
