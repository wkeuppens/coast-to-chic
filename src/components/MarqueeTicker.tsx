import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { useCurrentDistance } from '@/hooks/useCurrentDistance';

const staticStats = [
  '5 countries',
  '350 runners',
  '3 books',
  'Since 2019',
  'Athens by 2026',
];

export const MarqueeTicker = () => {
  const { distance } = useCurrentDistance(60000);
  const formattedDistance = `${distance.toLocaleString('en-US')} km`;
  const containerRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  // Smoother spring for that Apple feel
  const smoothX = useSpring(baseX, { 
    damping: 40, 
    stiffness: 90,
    mass: 1
  });
  
  const isHovering = useRef(false);
  const userVelocity = useRef(0);
  const lastInteractionTime = useRef(0);

  const stats = [formattedDistance, ...staticStats];
  const items = [...stats, ...stats, ...stats, ...stats];
  const itemSetWidth = 1600;

  // Base auto-scroll speed
  const baseSpeed = -0.4;
  // Friction for smooth deceleration (higher = more friction)
  const friction = 0.985;
  // Minimum velocity before resuming auto-scroll
  const velocityThreshold = 0.05;
  // Delay before resuming auto-scroll after interaction (ms)
  const resumeDelay = 800;
  
  useAnimationFrame((time) => {
    const now = Date.now();
    const timeSinceInteraction = now - lastInteractionTime.current;
    
    // Apply user velocity with smooth friction decay
    if (Math.abs(userVelocity.current) > velocityThreshold) {
      baseX.set(baseX.get() + userVelocity.current);
      userVelocity.current *= friction;
    } else if (!isHovering.current || timeSinceInteraction > resumeDelay) {
      // Resume auto-scroll when not hovering or after delay
      userVelocity.current = 0;
      if (!isHovering.current) {
        baseX.set(baseX.get() + baseSpeed);
      }
    }
    
    // Seamless loop
    const currentX = baseX.get();
    if (currentX < -itemSetWidth) {
      baseX.set(currentX + itemSetWidth);
    } else if (currentX > 0) {
      baseX.set(currentX - itemSetWidth);
    }
  });

  // Handle wheel scroll on desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    lastInteractionTime.current = Date.now();
    
    // Use deltaX for horizontal scroll, deltaY for vertical (convert to horizontal)
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    
    // Add to velocity for momentum feel
    userVelocity.current -= delta * 0.8;
  }, []);

  const handleDragEnd = (event: any, info: { velocity: { x: number } }) => {
    lastInteractionTime.current = Date.now();
    // Convert drag velocity to smooth momentum
    userVelocity.current = info.velocity.x * 0.15;
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    // Let momentum continue naturally
  };

  return (
    <div 
      ref={containerRef}
      className="py-6 bg-foreground text-primary-foreground overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        style={{ x: smoothX }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => { 
          lastInteractionTime.current = Date.now();
          userVelocity.current = 0; 
        }}
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
