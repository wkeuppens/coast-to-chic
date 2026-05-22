import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp } from './CountUp';
import { useSiteSettings } from '@/hooks/useSanityData';

export const MarqueeTicker = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const { data: settings } = useSiteSettings();

  const stats = [
    { value: settings?.totalKm ?? 0, label: 'km' },
    { value: settings?.totalCountries ?? 0, label: 'countries' },
    { value: settings?.totalRunners ?? 0, label: 'runners' },
    { value: settings?.booksSold ?? 0, label: 'books published' },
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
