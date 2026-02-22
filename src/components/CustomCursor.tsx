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

/* Inline SVG runner silhouette — small running figure */
const RunnerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    {/* Head */}
    <circle cx="14" cy="4" r="2" fill="currentColor" />
    {/* Body / legs — stylised running pose */}
    <path
      d="M11.5 8L9 11.5L6.5 11L5 13L7 14L10 12L11 14.5L8.5 19L10.5 20L13 15.5L15 18L14 22H16.5L17 17L14 13L15 10L18 11.5L19 9.5L14 7.5L11.5 8Z"
      fill="currentColor"
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

      {/* Cursor ring */}
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
    </>
  );
};
