import { useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

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
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);

  const items = [...stats, ...stats, ...stats, ...stats];

  const startAutoScroll = () => {
    controls.start({
      x: ['0%', '-50%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 30,
          ease: 'linear',
        },
      },
    });
  };

  // Start animation on mount
  useState(() => {
    startAutoScroll();
  });

  return (
    <div 
      ref={containerRef} 
      className="py-6 bg-foreground text-primary-foreground overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={controls}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDragStart={() => {
          setIsDragging(true);
          controls.stop();
        }}
        onDragEnd={() => {
          setIsDragging(false);
          startAutoScroll();
        }}
        onHoverStart={() => {
          if (!isDragging) controls.stop();
        }}
        onHoverEnd={() => {
          if (!isDragging) startAutoScroll();
        }}
      >
        {items.map((stat, index) => (
          <span
            key={index}
            className="text-sm font-display tracking-wider uppercase flex items-center gap-12 select-none"
          >
            {stat}
            <span className="text-white/30">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};
