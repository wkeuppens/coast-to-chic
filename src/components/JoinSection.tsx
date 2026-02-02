import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const JoinSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="join" className="relative py-24 md:py-40 overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div ref={ref} className="relative z-10 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm text-white/50 tracking-wide mb-4">Participate</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] mb-8">
            Open stages
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-12 leading-relaxed">
            Teams register for available stages.
            <br />
            Four to eight runners per team. 24 hours to complete.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#stages" 
              className="inline-flex items-center justify-center gap-3 bg-accent text-accent-foreground px-8 py-5 hover:opacity-90 transition-opacity"
            >
              <span className="font-display text-lg font-medium">View Stages</span>
              <span className="text-xl">→</span>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-5 hover:bg-white hover:text-black transition-all"
            >
              <span className="font-display font-medium">Watch Film</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};