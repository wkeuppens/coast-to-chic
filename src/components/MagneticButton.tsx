import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

export const MagneticButton = ({ 
  children, 
  className = '',
  href,
  onClick,
  strength = 0.3
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * strength;
    const y = (clientY - top - height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? motion.a : motion.button;

  return (
    <div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}>
      <Component
        href={href}
        onClick={onClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className={className}
      >
        {children}
      </Component>
    </div>
  );
};
