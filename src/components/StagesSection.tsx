import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MagneticButton } from './MagneticButton';

const stageTypes = [
  {
    id: 'eu',
    title: 'EU Stages',
    description: 'Italy to Greece. The main line.',
    status: '2026 open',
  },
  {
    id: 'us',
    title: 'US Stages',
    description: 'West coast. Limited.',
    status: 'Soon',
  },
  {
    id: 'shared',
    title: 'Shared Stages',
    description: 'Same day. Multiple teams.',
    status: 'Open',
  },
];

export const StagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stages" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              Stages
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground">
              Available registrations
            </h2>
          </div>
          <MagneticButton
            href="#" 
            className="text-sm font-medium text-foreground"
            strength={0.3}
          >
            <span className="border-b border-foreground pb-1">
              View all stages →
            </span>
          </MagneticButton>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0 border-t border-border">
          {stageTypes.map((stage, index) => (
            <motion.a
              key={stage.id}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="border-b md:border-b-0 md:border-r border-border last:border-r-0 py-12 md:pr-12 group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stage.status}
                </span>
              </div>
              <h3 className="font-display text-2xl font-medium text-foreground mb-3 group-hover:text-accent transition-colors">
                {stage.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {stage.description}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Note about selling out */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          Stages fill fast. Minutes, usually.
        </motion.p>
      </div>
    </section>
  );
};
