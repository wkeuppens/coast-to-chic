import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export const SupportSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div ref={ref} className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-2xl md:text-3xl mb-4"
        >
          This journey moves with support
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto"
        >
          Follow the Coast continues thanks to runners, readers, and partners who choose to carry it forward.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/support"
            className="inline-block px-8 py-3 rounded-full bg-foreground text-primary-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground/90 transition-colors"
          >
            Support the Project
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
