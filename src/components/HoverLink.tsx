import { motion } from 'framer-motion';

interface HoverLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export const HoverLink = ({ children, href, className = '' }: HoverLinkProps) => {
  return (
    <a href={href} className={`group relative inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        whileHover={{ y: '-100%' }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute left-0 top-0 inline-block"
        initial={{ y: '100%' }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.span>
    </a>
  );
};

export const ScrambleText = ({ 
  children, 
  className = '' 
}: { 
  children: string; 
  className?: string 
}) => {
  return (
    <span className={`relative inline-block group ${className}`}>
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-accent">
        {children}
      </span>
    </span>
  );
};
