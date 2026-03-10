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
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Title block — bottom-aligned */}
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
          <p className="text-caption text-primary-foreground/60 max-w-md mb-8">
            <span className="inline-block w-3 h-px bg-accent mr-2 align-middle" />
            All of Europe's coastline. Counter-clockwise. 100 km at a time.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <MagneticButton
              href="/register"
              className="inline-flex items-center justify-center bg-primary-foreground text-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-90 transition-opacity"
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
