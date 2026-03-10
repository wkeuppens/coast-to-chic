import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface EditorialIntroProps {
  label?: string;
  heading: string;
  body?: string;
  children?: React.ReactNode;
}

/**
 * Section opener — label + large heading + optional body text.
 * Quiet, restrained, editorial.
 */
export const EditorialIntro = ({ label, heading, body, children }: EditorialIntroProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="px-page max-w-content mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {label && (
          <p className="text-label mb-element">{label}</p>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] tracking-tight text-balance leading-[1.1] mb-block">
          {heading}
        </h2>
        {body && (
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-text">
            {body}
          </p>
        )}
        {children}
      </motion.div>
    </div>
  );
};
