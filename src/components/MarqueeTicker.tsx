import { motion } from 'framer-motion';

const stats = [
  '16,000 km',
  '5 countries',
  '350 runners',
  '3 books',
  'Since 2019',
  'Athens by 2026',
];

export const MarqueeTicker = () => {
  const items = [...stats, ...stats, ...stats, ...stats];

  return (
    <div className="py-6 bg-foreground text-primary-foreground overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: ['0%', '-25%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
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
