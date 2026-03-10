import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface PullQuoteProps {
  text: string;
  variant?: 'light' | 'dark';
}

/**
 * Pull quote — large serif text with word-by-word scroll reveal.
 * Like a chapter epigraph.
 */
export const PullQuote = ({ text, variant = 'light' }: PullQuoteProps) => {
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
      className={`py-chapter px-page ${isDark ? 'bg-foreground text-primary-foreground' : ''}`}
    >
      <div className="max-w-wide mx-auto">
        <p className="font-body text-2xl md:text-4xl lg:text-5xl leading-[1.25] tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <RevealWord key={i} progress={scrollYProgress} range={[start, end]}>{word}</RevealWord>;
          })}
        </p>
      </div>
    </section>
  );
};

const RevealWord = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
};
