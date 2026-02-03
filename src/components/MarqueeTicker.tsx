import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform, useAnimationFrame } from 'framer-motion';
import { wrap } from '@popmotion/popcorn';

const stats = [
  '16,000 km',
  '5 countries',
  '350 runners',
  '3 books',
  'Since 2019',
  'Athens by 2026',
];

export const MarqueeTicker = () => {
  const baseX = useMotionValue(0);
  const smoothX = useSpring(baseX, { damping: 50, stiffness: 400 });
  const velocityX = useVelocity(smoothX);
  const isPaused = useRef(false);
  const dragVelocity = useRef(0);

  const items = [...stats, ...stats, ...stats, ...stats];

  // Base scroll speed (pixels per frame)
  const baseSpeed = -0.5;
  
  useAnimationFrame((t, delta) => {
    if (isPaused.current) return;
    
    // Apply drag velocity with decay
    if (Math.abs(dragVelocity.current) > 0.1) {
      baseX.set(baseX.get() + dragVelocity.current);
      dragVelocity.current *= 0.98; // Friction decay
    } else {
      // Normal auto-scroll
      dragVelocity.current = 0;
      baseX.set(baseX.get() + baseSpeed);
    }
    
    // Loop seamlessly
    const currentX = baseX.get();
    if (currentX < -1600) {
      baseX.set(currentX + 1600);
    } else if (currentX > 0) {
      baseX.set(currentX - 1600);
    }
  });

  const handleDragEnd = (event: any, info: { velocity: { x: number } }) => {
    // Convert velocity to momentum
    dragVelocity.current = info.velocity.x * 0.05;
    isPaused.current = false;
  };

  return (
    <div 
      className="py-6 bg-foreground text-primary-foreground overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        style={{ x: smoothX }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={() => { isPaused.current = true; }}
        onDrag={(event, info) => {
          baseX.set(baseX.get() + info.delta.x);
        }}
        onDragEnd={handleDragEnd}
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
