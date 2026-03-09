import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';

export const SupportSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-3xl mx-auto">
        <hr className="rule mb-12" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-caption text-muted-foreground mb-6">
            <EditorialArrow size={12} className="mr-2 opacity-40" />
            Support
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            This journey moves with support
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xl">
            Follow the Coast continues thanks to runners, readers, and partners who choose to carry it forward.
          </p>
          <Link
            to="/support"
            className="inline-flex items-center gap-2 text-sm font-display uppercase tracking-wider hover:opacity-60 transition-opacity"
          >
            <EditorialArrow size={14} />
            Support the Project
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
