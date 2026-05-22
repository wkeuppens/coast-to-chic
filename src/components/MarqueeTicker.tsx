import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp } from './CountUp';
import { useSiteSettings } from '@/hooks/useSanityData';
import { calculateCurrentDistance } from '@/lib/distanceCalculator';
import { calculateCountries, calculateRunners, calculateBooks } from '@/lib/counterCalculator';

export const MarqueeTicker = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const { data: settings } = useSiteSettings();

  // Use Sanity values when set, otherwise fall back to live calculated values
  const stats = [
    { value: settings?.totalKm || calculateCurrentDistance(), label: 'km' },
    { value: settings?.totalCountries || calculateCountries(), label: 'countries' },
    { value: settings?.totalRunners || calculateRunners(), label: 'runners' },
    { value: settings?.booksSold || calculateBooks(), label: 'books published' },
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
                className="text-3xl md:text-4xl tracking-tight block text-foreground"
              />
              <p className="text-caption text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
