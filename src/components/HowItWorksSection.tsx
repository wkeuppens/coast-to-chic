import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Pick a stage',
    description: '100 km of coastline. You choose which one.',
  },
  {
    number: '02',
    title: 'Plan the route',
    description: 'We give you start and finish. You figure out the middle.',
  },
  {
    number: '03',
    title: 'Run it',
    description: <>7am. A van. A <Link to="/photographers" className="underline underline-offset-2 hover:text-white transition-colors">photographer</Link>. 24 hours.</>,
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-sm text-white/50 tracking-wide mb-4">
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium">
            A van. A photographer. You.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0 border-t border-white/10">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 py-12 md:pr-12"
            >
              <span className="text-sm text-accent">{step.number}</span>
              <h3 className="font-display text-xl font-medium mt-4 mb-3">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
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
            <p className="text-sm text-white/50 tracking-wide mb-4">
              Support included
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent">—</span>
                <span>Van with driver. 24 hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">—</span>
                <span>Photographer. All day.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">—</span>
                <span>Food. Water. Coffee.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">—</span>
                <span>Photos after. One book per runner.</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-white/50 tracking-wide mb-4">
              Participation fee
            </p>
            <div className="space-y-3">
              <p>€699 for 1 person</p>
              <p>€999 for 2 people</p>
              <p>€1299 for 3 or more</p>
            </div>
            <p className="text-sm text-white/50 mt-6">
              Covers crew, fuel, lodging, <Link to="/photographers" className="underline underline-offset-2 hover:text-white transition-colors">photographer</Link>, food.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
