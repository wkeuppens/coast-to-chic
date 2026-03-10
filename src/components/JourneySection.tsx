import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { RouteMap } from './RouteMap';

/**
 * The project story — calm editorial text with the route map.
 * Like the introduction pages of a documentary book.
 */
export const JourneySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-section px-page">
      <div ref={ref} className="max-w-content mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Text — restrained editorial prose */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-label mb-element">The route</p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-tight leading-[1.1] mb-block">
              Sea on the right.
              <br />
              Always south.
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed max-w-text">
              <p>
                Started July 2019 from a beach in Knokke. Salt air, grey sky, 
                bare feet on wet sand. The simple rule: keep the sea on your right 
                and run south.
              </p>
              <p>
                Belgium. France. Spain. Portugal. Now Italy.
                Each stage is 100 kilometres of coastline — one day, one van, 
                one photographer.
              </p>
              <p>Athens by end of 2026.</p>
            </div>
          </motion.div>

          {/* Route map — draws itself */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="aspect-square flex items-center justify-center"
          >
            <RouteMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
