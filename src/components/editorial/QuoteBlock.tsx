import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface QuoteBlockProps {
  text: string;
  variant?: 'light' | 'dark';
}

/**
 * Large editorial pull quote — words reveal as the reader scrolls,
 * like slowly reading a line in a book.
 */
export const QuoteBlock = ({ text, variant = 'light' }: QuoteBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const words = text.split(' ');
  const isDark = variant === 'dark';

  return (
    <section
      ref={ref}
      className={`py-chapter px-page ${
        isDark ? 'bg-foreground text-primary-foreground' : ''
      }`}
    >
      <div className="max-w-wide mx-auto">
        <p className="font-body text-2xl md:text-4xl lg:text-5xl leading-[1.25] tracking-tight">
          {words.map((word, index) => {
            const start = index / words.length;
            const end = start + 1 / words.length;
            return (
              <WordReveal key={index} progress={scrollYProgress} range={[start, end]}>
                {word}
              </WordReveal>
            );
          })}
        </p>
      </div>
    </section>
  );
};

const WordReveal = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
};
