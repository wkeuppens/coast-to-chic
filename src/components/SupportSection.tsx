import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MagneticButton } from './MagneticButton';

/**
 * Support section — quiet, editorial. No loud CTA.
 */
export const SupportSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-section px-page">
      <div ref={ref} className="max-w-text mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <hr className="rule mb-8" />
          <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Support</p>
          <h2 className="text-2xl md:text-3xl tracking-tight mb-block">
            This journey moves with support
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-text">
            Follow the Coast continues thanks to runners, readers, and partners 
            who choose to carry it forward.
          </p>
          <MagneticButton
            href="/support"
            className="inline-flex items-center justify-center bg-foreground text-primary-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-80 transition-opacity"
          >
            Support the project
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};
