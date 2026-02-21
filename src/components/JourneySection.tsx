import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp } from './CountUp';
import { RouteMap } from './RouteMap';
import { useCurrentDistance } from '@/hooks/useCurrentDistance';

export const JourneySection = () => {
  const { distance, countries, runners, books } = useCurrentDistance(60000);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="journey" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Stats grid - factual, no embellishment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-24"
        >
          <StatBlock>
            <CountUp end={distance} className="font-display text-4xl md:text-5xl font-medium text-foreground" />
            <p className="text-sm text-muted-foreground mt-2">km completed</p>
          </StatBlock>
          <StatBlock>
            <CountUp end={countries} className="font-display text-4xl md:text-5xl font-medium text-foreground" />
            <p className="text-sm text-muted-foreground mt-2">countries</p>
          </StatBlock>
          <StatBlock>
            <CountUp end={runners} className="font-display text-4xl md:text-5xl font-medium text-foreground" />
            <p className="text-sm text-muted-foreground mt-2">runners</p>
          </StatBlock>
          <StatBlock>
            <CountUp end={books} className="font-display text-4xl md:text-5xl font-medium text-foreground" />
            <p className="text-sm text-muted-foreground mt-2">books</p>
          </StatBlock>
        </motion.div>

        {/* The map / journey description */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              The route
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground leading-tight mb-6">
              Sea on the right.
              <br />
              Always south.
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Started July 2019. A beach in Knokke. Salt air, grey sky.</p>
              <p>Belgium. France. Spain. Portugal. Now Italy.</p>
              <p>Athens by 2026. Rain or shine. Storms don't wait, neither do we.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="aspect-square flex items-center justify-center"
          >
            <RouteMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StatBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-2 border-accent/40 pl-6">
    {children}
  </div>
);
