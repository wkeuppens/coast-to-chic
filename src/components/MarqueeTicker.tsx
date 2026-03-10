import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp } from './CountUp';
import { useCurrentDistance } from '@/hooks/useCurrentDistance';

/**
 * Quiet data strip — like the colophon data in the book.
 * Stats arrive calmly, no fanfare.
 */
export const MarqueeTicker = () => {
  const { distance, countries, runners, books } = useCurrentDistance(60000);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const stats = [
    { value: distance, label: 'km' },
    { value: countries, label: 'countries' },
    { value: runners, label: 'runners' },
    { value: books, label: 'books published' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="px-page py-section"
    >
      <div className="max-w-content mx-auto">
        <hr className="rule mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label}>
              <CountUp
                end={stat.value}
                className="font-display text-3xl md:text-4xl tracking-tight block text-foreground"
              />
              <p className="text-caption text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
