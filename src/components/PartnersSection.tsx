import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = ['Duvel', 'Victus', 'D\'Ieteren'];

export const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-6xl mx-auto">
        <hr className="rule-light mb-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <p className="text-caption text-muted-foreground">
            Partners
          </p>
          <div className="flex flex-wrap gap-10 md:gap-14">
            {partners.map((partner, index) => (
              <motion.span
                key={partner}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="text-muted-foreground font-display text-base tracking-wider uppercase"
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
