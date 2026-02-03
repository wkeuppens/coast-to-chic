import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const stats = [
  '16,000 km',
  '5 countries',
  '350 runners',
  '3 books',
  'Since 2019',
  'Athens by 2026',
];

export const MarqueeTicker = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  // Move left as user scrolls down
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);

  const items = [...stats, ...stats, ...stats];

  return (
    <div ref={containerRef} className="py-6 bg-foreground text-primary-foreground overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        style={{ x }}
      >
        {items.map((stat, index) => (
          <span
            key={index}
            className="text-sm font-display tracking-wider uppercase flex items-center gap-12"
          >
            {stat}
            <span className="text-white/30">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};
