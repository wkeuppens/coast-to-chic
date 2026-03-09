import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp } from './CountUp';
import { RouteMap } from './RouteMap';
import { EditorialArrow } from './EditorialArrow';
import { useCurrentDistance } from '@/hooks/useCurrentDistance';

export const JourneySection = () => {
  const { distance, countries, runners, books } = useCurrentDistance(60000);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="journey" className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Stats — clean data table like the book */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <hr className="rule mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-32">
            <div>
              <CountUp end={distance} className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight block" />
              <p className="text-caption text-muted-foreground mt-2">km completed</p>
            </div>
            <div>
              <CountUp end={countries} className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight block" />
              <p className="text-caption text-muted-foreground mt-2">countries</p>
            </div>
            <div>
              <CountUp end={runners} className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight block" />
              <p className="text-caption text-muted-foreground mt-2">runners</p>
            </div>
            <div>
              <CountUp end={books} className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight block" />
              <p className="text-caption text-muted-foreground mt-2">books</p>
            </div>
          </div>
        </motion.div>

        {/* The route description — book spread style */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-caption text-muted-foreground mb-6">
              <EditorialArrow size={12} className="mr-2 opacity-40" />
              The route
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-8">
              Sea on the right.
              <br />
              Always south.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>Started July 2019. A beach in Knokke. Salt air, grey sky.</p>
              <p>Belgium. France. Spain. Portugal. Now Italy.</p>
              <p>Athens by end of 2026.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="aspect-square flex items-center justify-center"
          >
            <RouteMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
