import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls, useMotionValue, animate } from 'framer-motion';

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
  const x = useMotionValue(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const items = [...stats, ...stats, ...stats, ...stats];
  
  // Width of one set of items (for seamless looping)
  const itemSetWidth = 1600; // Approximate width of one set

  const startAutoScroll = (fromCurrentPosition = true) => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    const currentX = fromCurrentPosition ? x.get() : 0;
    // Normalize position to create seamless loop
    const normalizedX = currentX % itemSetWidth;
    
    animationRef.current = animate(x, [normalizedX, normalizedX - itemSetWidth], {
      duration: 30,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
  };

  useEffect(() => {
    startAutoScroll(false);
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const handleDragEnd = (event: any, info: { velocity: { x: number } }) => {
    setIsInteracting(false);
    
    const velocity = info.velocity.x;
    const currentX = x.get();
    
    // Calculate momentum distance based on velocity
    const momentumDistance = velocity * 0.5;
    const targetX = currentX + momentumDistance;
    
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    // Animate with momentum first, then resume auto-scroll
    animationRef.current = animate(x, targetX, {
      type: 'spring',
      velocity: velocity,
      stiffness: 50,
      damping: 20,
      onComplete: () => {
        // Resume auto-scroll after momentum settles
        startAutoScroll(true);
      },
    });
  };

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="py-6 bg-foreground text-primary-foreground overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => {
        if (!isInteracting && animationRef.current) {
          animationRef.current.stop();
        }
      }}
      onMouseLeave={() => {
        if (!isInteracting) {
          startAutoScroll(true);
        }
      }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -10000, right: 10000 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleInteractionStart}
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
