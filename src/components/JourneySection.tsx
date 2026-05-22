import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { RouteMap } from './RouteMap';
import { useSiteSettings } from '@/hooks/useSanityData';

const FALLBACK_PARAGRAPHS = [
  'Started July 2019 from a beach in Knokke. Salt air, grey sky. The simple rule: keep the sea on your right and run south.',
  'Belgium. France. Spain. Portugal. Now Italy.',
  'Athens by end of 2026.',
];

export const JourneySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: settings } = useSiteSettings();

  const label = settings?.journeyLabel ?? 'The route';
  const headline = settings?.journeyHeadline ?? 'Sea on the right. Always south.';
  const paragraphs = settings?.journeyParagraphs?.length
    ? settings.journeyParagraphs
    : FALLBACK_PARAGRAPHS;

  return (
    <section className="py-section px-page">
      <div ref={ref} className="max-w-content mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-label mb-element">
              <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />{label}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight leading-[1.1] mb-block">
              {headline.split('. ').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 ? '.' : ''}{i < arr.length - 1 ? <br /> : ''}</span>
              ))}
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed max-w-text">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </motion.div>
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
