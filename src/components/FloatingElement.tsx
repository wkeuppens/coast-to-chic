import { motion } from 'framer-motion';

interface FloatingElementProps {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
}

export const FloatingElement = ({
  children,
  className = '',
  duration = 6,
  delay = 0,
  distance = 10,
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxText = ({ 
  children, 
  className = '' 
}: { 
  children: string; 
  className?: string 
}) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex gap-8"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="shrink-0">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
