import { useRef, useState, useEffect } from 'react';
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
  const [isInteracting, setIsInteracting] = useState(false);

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

  useEffect(() => {
    startAutoScroll();
  }, []);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    controls.stop();
  };

  const handleInteractionEnd = () => {
    setIsInteracting(false);
    startAutoScroll();
  };

  return (
    <div 
      ref={containerRef} 
      className="py-6 bg-foreground text-primary-foreground overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x"
      onMouseEnter={() => !isInteracting && controls.stop()}
      onMouseLeave={() => !isInteracting && startAutoScroll()}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -2000, right: 200 }}
        dragElastic={0.05}
        dragMomentum={true}
        onDragStart={handleInteractionStart}
        onDragEnd={handleInteractionEnd}
      >
        {items.map((stat, index) => (
          <span
            key={index}
            className="text-sm font-display tracking-wider uppercase flex items-center gap-12 select-none pointer-events-none"
          >
            {stat}
            <span className="text-white/30">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};
