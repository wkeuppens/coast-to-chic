import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';

export const SupportSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 lg:px-24 border-t border-border">
      <div ref={ref} className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-caption text-muted-foreground mb-6"
        >
          Support
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-4xl font-bold mb-6"
        >
          This journey moves with support
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto"
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-primary-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground/90 transition-colors"
          >
            <EditorialArrow size={14} className="invert" />
            Support the Project
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
