import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Pick a stage',
    description: '100 km of coastline. You choose where.',
  },
  {
    number: '02',
    title: 'Plan the route',
    description: 'We give start and finish. You shape the middle.',
  },
  {
    number: '03',
    title: 'Run it',
    description: <>7am start. A van. A <Link to="/photographers" className="underline underline-offset-2 hover:text-foreground transition-colors">photographer</Link>. 24 hours moving.</>,
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-28 md:py-40 px-6 md:px-12 lg:px-24 bg-secondary">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Orientation layer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground tracking-wide mb-3">
            How it works
          </p>
          <p className="text-muted-foreground text-base">
            Run one stage of Europe's coastline.
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl md:text-4xl font-medium mb-20"
        >
          A van. A photographer. You.
        </motion.h2>

        {/* 3-step grid */}
        <div className="grid md:grid-cols-3 gap-16 border-t border-border pt-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.15 }}
              className={index > 0 ? 'md:border-l md:border-border md:pl-16' : ''}
            >
              <span className="text-sm text-accent font-display">{step.number}</span>
              <h3 className="font-display text-xl font-medium mt-4 mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Support & Fee blocks */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 grid md:grid-cols-2 gap-16"
        >
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-5">
              Support included
            </p>
            <ul className="space-y-3 text-foreground">
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
            <p className="text-sm text-muted-foreground tracking-wide mb-5">
              Participation fee
            </p>
            <div className="space-y-3 text-foreground">
              <p>€699 for 1 person</p>
              <p>€999 for 2 people</p>
              <p>€1299 for 3 or more</p>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Covers crew, fuel, lodging, <Link to="/photographers" className="underline underline-offset-2 hover:text-foreground transition-colors">photographer</Link>, food.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
