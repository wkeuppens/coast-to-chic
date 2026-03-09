import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';

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
    <section id="stages" className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-caption text-muted-foreground mb-4">
              <EditorialArrow size={12} className="mr-2 opacity-40" />
              Stages
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Available registrations
            </h2>
          </div>
          <Link to="/all-stages" className="text-caption text-muted-foreground hover:text-foreground transition-colors">
            View all stages →
          </Link>
        </motion.div>

        <hr className="rule mb-0" />

        {stageTypes.map((stage, index) => (
          <Link key={stage.id} to={stage.href}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border-b border-foreground py-8 group flex items-center justify-between"
            >
              <div>
                <h3 className="font-display text-xl font-medium text-foreground group-hover:opacity-60 transition-opacity mb-1">
                  {stage.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stage.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-caption text-muted-foreground hidden sm:block">
                  {stage.status}
                </span>
                <EditorialArrow size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-xs text-muted-foreground"
        >
          Stages fill fast. Minutes, usually.
        </motion.p>
      </div>
    </section>
  );
};
