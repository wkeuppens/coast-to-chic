import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const stageTypes = [
  {
    id: 'eu',
    title: 'EU Stages',
    description: 'Italy to Greece. The main line.',
    detail: '2026 — Open for registration',
    href: '/register',
  },
  {
    id: 'homerun',
    title: 'Home Run',
    description: 'Venice. 100 km. Shared stage.',
    detail: '€199 — Open',
    href: '/homerun',
  },
];

/**
 * Available stages — clean editorial list.
 * No cards, no boxes, just quiet rows like a table of contents.
 */
export const StagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stages" className="py-section px-page">
      <div ref={ref} className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-block"
        >
          <div>
            <p className="text-label mb-element">Stages</p>
            <h2 className="font-display text-2xl md:text-3xl tracking-tight">
              Available registrations
            </h2>
          </div>
          <Link to="/all-stages" className="text-caption text-muted-foreground hover:text-foreground transition-colors">
            All stages →
          </Link>
        </motion.div>

        <hr className="rule-dark" />

        {stageTypes.map((stage, i) => (
          <Link key={stage.id} to={stage.href}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group py-6 md:py-8 border-b border-foreground/15 flex items-baseline justify-between gap-4"
            >
              <div>
                <h3 className="font-display text-lg md:text-xl group-hover:opacity-50 transition-opacity duration-500">
                  {stage.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {stage.description}
                </p>
              </div>
              <span className="text-caption text-muted-foreground shrink-0 hidden sm:block">
                {stage.detail}
              </span>
            </motion.div>
          </Link>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          Stages fill fast. Minutes, usually.
        </motion.p>
      </div>
    </section>
  );
};
