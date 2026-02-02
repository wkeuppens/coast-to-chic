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

      <div ref={ref} className="relative z-10 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm text-white/50 tracking-wide mb-4">Be Part of It</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] mb-8">
            Your 100km
            <br />
            is waiting.
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-12 leading-relaxed">
            This isn't just a run. It's your chapter in a story that spans 
            an entire continent. Pick a stage. Gather your team. Make history.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="inline-flex items-center justify-center gap-3 bg-accent text-accent-foreground px-8 py-5 hover:opacity-90 transition-opacity"
            >
              <span className="font-display text-lg font-medium">Pick Your Stage</span>
              <span className="text-xl">→</span>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-5 hover:bg-white hover:text-black transition-all"
            >
              <span className="font-display font-medium">Watch the Film</span>
            </a>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 pt-12 border-t border-white/20"
        >
          <blockquote className="font-display text-2xl md:text-3xl text-white/80 italic">
            "No human is limited."
          </blockquote>
          <cite className="block mt-4 text-sm text-white/50 not-italic">
            — Eliud Kipchoge
          </cite>
        </motion.div>
      </div>
    </section>
  );
};