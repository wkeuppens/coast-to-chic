import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';
import { MagneticButton } from './MagneticButton';

const stageTypes = [
  {
    id: 'eu',
    title: 'EU Stages',
    description: 'Italy to Greece. The main line.',
    status: '2026 open',
    href: '/register',
  },
  {
    id: 'homerun',
    title: 'Home Run',
    description: 'Venice. 100km. Shared stage. €199.',
    status: 'Open',
    href: '/homerun',
  },
];

export const StagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stages" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-caption text-muted-foreground mb-4">
              Stages
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Available registrations
            </h2>
          </div>
          <Link to="/all-stages">
            <MagneticButton
              className="text-sm font-medium text-foreground"
              strength={0.3}
            >
              <span className="inline-flex items-center gap-2 border-b border-accent pb-1 text-accent">
                <EditorialArrow size={14} className="opacity-70" />
                View all stages
              </span>
            </MagneticButton>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0 border-t border-border">
          {stageTypes.map((stage, index) => (
            <Link key={stage.id} to={stage.href}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="border-b md:border-b-0 md:border-r border-border last:border-r-0 py-12 md:pr-12 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-caption text-muted-foreground">
                    {stage.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex-shrink-0">
                    <EditorialArrow size={16} />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                    {stage.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
                  {stage.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-label"
        >
          Stages fill fast. Minutes, usually.
        </motion.p>
      </div>
    </section>
  );
};
