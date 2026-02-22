import { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

interface CustomCursorProps {
  variant?: 'default' | 'runner';
}

/* Inline SVG — dynamic running silhouette */
const RunnerIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head */}
    <circle cx="19.5" cy="5.5" r="2.8" fill="white" />
    {/* Torso leaning forward, arms and legs in full stride */}
    <path
      d="M17.2 9.5L14 12.5L10 11L8 13.5L11.5 15L13.5 13L12 18L8 23.5L10.5 25L14.5 19.5L16.5 22L15.5 28H18.5L19 21L15.5 16L17 12L21 14L23 11L18.5 9L17.2 9.5Z"
      fill="white"
    />
    {/* Back arm */}
    <path
      d="M17 11.5L21 9L23.5 10.5L22 12.5L18 11"
      fill="white"
    />
  </svg>
);

export const CustomCursor = ({ variant = 'default' }: CustomCursorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailIdRef = useRef(0);

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Add trail point
      trailIdRef.current += 1;
      setTrail((prev) => [
        ...prev.slice(-8), // Keep last 8 points
        { x: e.clientX, y: e.clientY, id: trailIdRef.current },
      ]);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer' ||
        target.closest('[data-cursor="pointer"]');

      const hasText = target.dataset.cursorText || target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      
      if (isInteractive) {
        setIsHovering(true);
        if (hasText) {
          setCursorText(hasText);
        }
      }

      // Hide cursor on inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsHidden(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer' ||
        target.closest('[data-cursor="pointer"]');

      if (isInteractive) {
        setIsHovering(false);
        setCursorText('');
      }

      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsHidden(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  // Fade out trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Trail effect */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[9997]"
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4 }}
          style={{
            left: point.x,
            top: point.y,
          }}
        >
          <div
            className="w-1 h-1 -ml-0.5 -mt-0.5 rounded-full bg-foreground/20"
          />
        </motion.div>
      ))}

      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: isHidden ? 0 : isClicking ? 0.8 : isHovering ? 2.5 : 1,
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {variant === 'runner' ? (
            <div className="-ml-3 -mt-3" style={{ transform: 'translate(-50%, -50%)' }}>
              <RunnerIcon />
            </div>
          ) : (
            <div 
              className="w-4 h-4 -ml-2 -mt-2 rounded-full bg-white"
              style={{ transform: 'translate(-50%, -50%)' }}
            />
          )}
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute whitespace-nowrap text-[8px] font-medium text-background uppercase tracking-wider"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Cursor ring — hidden for runner variant */}
      {variant !== 'runner' && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        >
          <motion.div
            className="w-10 h-10 -ml-5 -mt-5 rounded-full border border-foreground/30"
            animate={{
              scale: isHidden ? 0 : isClicking ? 0.9 : isHovering ? 1.5 : 1,
              opacity: isHidden ? 0 : isHovering ? 0.5 : 0.3,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ 
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      )}
    </>
  );
};
