import { motion } from 'framer-motion';
import { TextReveal } from './TextReveal';
import { EditorialArrow } from './EditorialArrow';
import { RouteMap } from './RouteMap';
import coastalTown from '@/assets/coastal-town.jpg';

export const HeroSection = () => {
  return (
    <section className="spread min-h-screen">
      {/* Left: Full-bleed photograph */}
      <div className="relative min-h-[60vh] md:min-h-screen overflow-hidden">
        <img
          src={coastalTown}
          alt="Coastal town along the route"
          className="absolute inset-0 w-full h-full object-cover object-[35%_center] md:object-center"
        />
      </div>

      {/* Right: Title + metadata — mirroring book cover page */}
      <div className="flex flex-col justify-between p-8 md:p-16 lg:p-20 min-h-[60vh] md:min-h-screen">
        {/* Top: Title block */}
        <div className="pt-16 md:pt-24">
          <h1 className="font-display text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-[-0.02em] uppercase mb-6">
            <TextReveal delay={0.2}>FOLLOW</TextReveal>
            <br />
            <span className="flex items-center gap-3">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
                className="inline-block w-12 h-[3px] bg-foreground origin-left"
              />
              <TextReveal delay={0.4}>THE</TextReveal>
            </span>
            <TextReveal delay={0.6}>COAST</TextReveal>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="inline-block w-8 h-[3px] bg-foreground origin-left ml-3"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-caption text-muted-foreground mt-8"
          >
            All of Europe's coast. Counter-clockwise. One stage at a time.
          </motion.p>
        </div>

        {/* Middle: Route map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-full max-w-[280px] aspect-square my-8"
        >
          <RouteMap />
        </motion.div>

        {/* Bottom: Metadata + CTA — like book's credits block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <hr className="rule mb-8" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>The Atlantic Coast</p>
              <p>From Knokke to Athens</p>
            </div>
            <div className="flex gap-6">
              <a
                href="/register"
                className="inline-flex items-center gap-2 text-sm font-display uppercase tracking-wider hover:opacity-60 transition-opacity"
              >
                <EditorialArrow size={16} />
                Register
              </a>
              <a
                href="#newsletter"
                className="text-sm font-display uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Newsletter
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
