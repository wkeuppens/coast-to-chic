import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
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

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
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
          <div 
            className="w-4 h-4 -ml-2 -mt-2 rounded-full bg-white"
            style={{ 
              transform: 'translate(-50%, -50%)',
            }}
          />
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
