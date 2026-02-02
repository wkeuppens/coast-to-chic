import { motion } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const TextReveal = ({ 
  children, 
  className = '', 
  delay = 0,
  staggerDelay = 0.03 
}: TextRevealProps) => {
  const words = children.split(' ');

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + wordIndex * staggerDelay * 3,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

interface CharRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const CharReveal = ({ children, className = '', delay = 0 }: CharRevealProps) => {
  const chars = children.split('');

  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.02,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};
