import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Register',
    description: 'Select a stage from the available list. Stages are 100km sections of coastline.',
  },
  {
    number: '02',
    title: 'Prepare',
    description: 'Map your route. The crew provides coordinates for start and finish. You plan the path between.',
  },
  {
    number: '03',
    title: 'Run',
    description: 'Meet the crew at 7am. Run for 24 hours. A photographer and support van travel with you.',
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-secondary">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-sm text-muted-foreground tracking-wide mb-4">
            The format
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground">
            100km. 24 hours. One team.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0 border-t border-border">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="border-b md:border-b-0 md:border-r border-border last:border-r-0 py-12 md:pr-12"
            >
              <span className="text-sm text-muted-foreground">{step.number}</span>
              <h3 className="font-display text-xl font-medium text-foreground mt-4 mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* What's included - factual list */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 grid md:grid-cols-2 gap-12"
        >
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              Support included
            </p>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">—</span>
                <span>Support van with driver, 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">—</span>
                <span>Professional photographer, full day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">—</span>
                <span>Food and water during the run</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">—</span>
                <span>Digital photos after completion</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">—</span>
                <span>One book per registered participant</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              Participation fee
            </p>
            <div className="space-y-3 text-foreground">
              <p>€699 for 1 person</p>
              <p>€999 for 2 people</p>
              <p>€1299 for 3 or more</p>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Covers crew, fuel, lodging, photographer, food.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
