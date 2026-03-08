import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface PullQuoteProps {
  text: string;
  variant?: 'light' | 'dark';
}

export const PullQuote = ({ text, variant = 'light' }: PullQuoteProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const words = text.split(' ');

  return (
    <section
      ref={ref}
      className={`py-32 md:py-48 px-6 md:px-12 lg:px-24 ${
        variant === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <p className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
          {words.map((word, index) => {
            const start = index / words.length;
            const end = start + 1 / words.length;

            return (
              <Word key={index} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
};

interface WordProps {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}

const Word = ({ children, progress, range }: WordProps) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [20, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.25em] transition-colors"
    >
      {children}
    </motion.span>
  );
};
