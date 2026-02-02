import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

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

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base text-white/70 mb-4 tracking-wide"
          >
            2025 — Malaga to Vibo Marina
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight"
          >
            We run
            <br />
            <span className="text-accent">the coast.</span>
            <br />
            Together.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
          >
            The longest relay run ever. Stage by stage, team by team, 
            we're writing the story of Europe's entire coastline.
          </motion.p>

          <motion.a
            href="#join"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-3 mt-10 text-white border border-white/30 px-6 py-4 hover:bg-white hover:text-black transition-all group"
          >
            <span className="font-display font-medium">Pick your Stage</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </motion.a>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 border-t border-white/20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          <StatItem number="9,800" label="km covered" />
          <StatItem number="100" label="km per stage" />
          <StatItem number="24" label="hours to finish" />
          <StatItem number="∞" label="stories created" />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-32 right-6 md:right-12 z-10"
      >
        <a href="#journey" className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors">
          <span className="text-xs tracking-widest rotate-90 origin-center translate-y-8">SCROLL</span>
          <ArrowDown size={16} className="animate-bounce mt-8" />
        </a>
      </motion.div>
    </section>
  );
};

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="px-6 md:px-12 py-6 md:py-8">
    <p className="font-display text-3xl md:text-4xl font-medium">{number}</p>
    <p className="text-sm text-white/60 mt-1">{label}</p>
  </div>
);