import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = ['Duvel', 'Victus', 'D\'Ieteren'];

export const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-background border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <p className="text-sm text-muted-foreground">
            Partners
          </p>
          <div className="flex flex-wrap gap-12 md:gap-16">
            {partners.map((partner, index) => (
              <motion.span
                key={partner}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-muted-foreground font-display text-lg"
              >
                {partner}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
