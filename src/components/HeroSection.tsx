import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { TextReveal, CharReveal } from './TextReveal';
import { MagneticButton } from './MagneticButton';
import { CountUp } from './CountUp';
import { FloatingElement } from './FloatingElement';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-foreground text-primary-foreground flex flex-col justify-between overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Floating ambient elements */}
      <FloatingElement 
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent/30 rounded-full blur-sm"
        duration={8}
        distance={20}
      />
      <FloatingElement 
        className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full"
        duration={6}
        delay={1}
        distance={15}
      />
      <FloatingElement 
        className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-accent/20 rounded-full blur-md"
        duration={10}
        delay={2}
        distance={25}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CharReveal 
              className="text-sm md:text-base text-white/70 mb-4 tracking-wide"
              delay={0.2}
            >
              2025 — Malaga to Vibo Marina
            </CharReveal>
          </motion.div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight">
            <TextReveal delay={0.4}>We run</TextReveal>
            <br />
            <span className="text-accent">
              <TextReveal delay={0.6}>the coast.</TextReveal>
            </span>
            <br />
            <TextReveal delay={0.8}>Together.</TextReveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
          >
            The longest relay run ever. Stage by stage, team by team, 
            we're writing the story of Europe's entire coastline.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-10"
          >
            <MagneticButton
              href="#join"
              className="inline-flex items-center gap-3 text-white border border-white/30 px-6 py-4 hover:bg-white hover:text-black transition-all duration-300 group"
              strength={0.2}
            >
              <span className="font-display font-medium">Pick your Stage</span>
              <motion.span 
                className="text-xl"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Stats bar with counting animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative z-10 border-t border-white/20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          <StatItem>
            <CountUp end={9800} className="font-display text-3xl md:text-4xl font-medium" />
            <p className="text-sm text-white/60 mt-1">km covered</p>
          </StatItem>
          <StatItem>
            <CountUp end={100} className="font-display text-3xl md:text-4xl font-medium" />
            <p className="text-sm text-white/60 mt-1">km per stage</p>
          </StatItem>
          <StatItem>
            <CountUp end={24} className="font-display text-3xl md:text-4xl font-medium" />
            <p className="text-sm text-white/60 mt-1">hours to finish</p>
          </StatItem>
          <StatItem>
            <motion.span 
              className="font-display text-3xl md:text-4xl font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              ∞
            </motion.span>
            <p className="text-sm text-white/60 mt-1">stories created</p>
          </StatItem>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-32 right-6 md:right-12 z-10"
      >
        <MagneticButton href="#journey" strength={0.4}>
          <span className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors">
            <motion.span 
              className="text-xs tracking-widest rotate-90 origin-center translate-y-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SCROLL
            </motion.span>
            <ArrowDown size={16} className="animate-bounce mt-8" />
          </span>
        </MagneticButton>
      </motion.div>
    </section>
  );
};

const StatItem = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 md:px-12 py-6 md:py-8 group cursor-default">
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  </div>
);
