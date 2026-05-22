import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSiteSettings } from '@/hooks/useSanityData';

const FALLBACK_PARTNERS = ['Duvel', 'Victus', "D'Ieteren"];

/**
 * Partners — minimal text list. No logos, no boxes.
 * Like a colophon acknowledgment. Content from Sanity CMS.
 */
export const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { data: settings } = useSiteSettings();

  const partners = settings?.partners?.length
    ? settings.partners.map(p => p.name)
    : FALLBACK_PARTNERS;

  return (
    <section className="px-page py-8 md:py-12">
      <div ref={ref} className="max-w-content mx-auto">
        <hr className="rule mb-8" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <p className="text-label">Partners</p>
          <div className="flex flex-wrap gap-8 md:gap-12">
            {partners.map((p) => (
              <span key={p} className="text-muted-foreground text-sm tracking-wider uppercase">
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
