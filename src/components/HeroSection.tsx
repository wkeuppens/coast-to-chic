import { motion } from 'framer-motion';
import { TextReveal } from './TextReveal';
import { MagneticButton } from './MagneticButton';
import { EditorialArrow } from './EditorialArrow';
import coastalTown from '@/assets/coastal-town.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-primary text-primary-foreground flex flex-col justify-end overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${coastalTown})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-caption text-inv-muted mb-6"
          >
            All of Europe's coast. Counter-clockwise. One stage at a time.
          </motion.p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-[7rem] font-black leading-[0.95] tracking-[-0.03em] uppercase mb-12 pr-2">
            <TextReveal delay={0.4}>Follow</TextReveal>
            <br />
            <TextReveal delay={0.6}>The Coast</TextReveal>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton
              href="/register"
              className="inline-flex items-center justify-center gap-3 bg-accent text-accent-foreground px-8 py-5 rounded-full hover:opacity-90 transition-opacity"
              strength={0.2}
            >
              <span className="font-display font-medium">Register for a stage</span>
              <EditorialArrow size={18} className="invert" />
            </MagneticButton>
            <MagneticButton
              href="#newsletter"
              className="inline-flex items-center justify-center gap-3 border border-inv-border text-inv px-8 py-5 rounded-full hover:bg-inv hover:text-foreground transition-all"
              strength={0.2}
            >
              <span className="font-display font-medium">Stay informed</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
