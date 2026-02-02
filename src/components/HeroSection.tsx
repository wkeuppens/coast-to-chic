import { motion } from 'framer-motion';
import { TextReveal } from './TextReveal';
import { MagneticButton } from './MagneticButton';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-foreground text-primary-foreground flex flex-col justify-end overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content - positioned lower, text below image area */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-white/60 tracking-wide mb-6 font-body"
          >
            16,000 km. Counter-clockwise. One stage at a time.
          </motion.p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight mb-12">
            <TextReveal delay={0.4}>Follow</TextReveal>
            <br />
            <TextReveal delay={0.6}>the Coast</TextReveal>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton
              href="#stages"
              className="inline-flex items-center justify-center gap-3 bg-accent text-accent-foreground px-8 py-5 hover:opacity-90 transition-opacity"
              strength={0.2}
            >
              <span className="font-display font-medium">Register</span>
            </MagneticButton>
            <MagneticButton
              href="#newsletter"
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-5 hover:bg-white hover:text-black transition-all"
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
