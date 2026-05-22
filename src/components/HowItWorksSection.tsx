import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSanityData';

const FALLBACK_STEPS = [
  { number: '01', title: 'Pick a stage', body: '100 km of coastline. You choose where.' },
  { number: '02', title: 'Plan the route', body: 'We give start and finish. You shape the middle.' },
  { number: '03', title: 'Run it', body: '7 am start. A van. A photographer. The coast.' },
];
const FALLBACK_SUPPORT = [
  'Van with driver, 24 hours',
  'Photographer, all day',
  'Food, water, coffee',
  'Photos delivered after. Your name in the book',
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { data: settings } = useSiteSettings();

  const headline = settings?.howItWorksHeadline ?? 'A van. A photographer. You.';
  const steps = settings?.howItWorksSteps?.length ? settings.howItWorksSteps : FALLBACK_STEPS;
  const support = settings?.supportIncluded?.length ? settings.supportIncluded : FALLBACK_SUPPORT;
  const pricingSolo = settings?.pricingSolo ?? 699;
  const pricingDuo = settings?.pricingDuo ?? 999;
  const pricingGroup = settings?.pricingGroup ?? 1299;

  return (
    <section className="py-section px-page">
      <div ref={ref} className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-block"
        >
          <p className="text-label mb-element">
            <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />How it works
          </p>
          <h2 className="text-2xl md:text-3xl tracking-tight">{headline}</h2>
        </motion.div>

        <hr className="rule mb-8" />
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 mb-block">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            >
              <span className="text-caption text-accent block mb-3">{step.number}</span>
              <h3 className="text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <hr className="rule mb-8" />
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-label mb-4">Support included</p>
              <ul className="space-y-2 text-sm text-foreground">
                {support.map((item, i) => (
                  <li key={i}><span className="text-accent">—</span> {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-label mb-4">Participation</p>
              <div className="space-y-1.5 text-sm text-foreground">
                <p>€{pricingSolo} — 1 person</p>
                <p>€{pricingDuo} — 2 people</p>
                <p>€{pricingGroup} — 3 or more</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4 max-w-text">
                Covers crew, fuel, lodging, <Link to="/photographers" className="underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground transition-colors">photographer</Link>, food.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
