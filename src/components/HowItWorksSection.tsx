import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';

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
    description: <>7am start. A van. A <Link to="/photographers" className="underline underline-offset-4 hover:text-foreground transition-colors">photographer</Link>. The beach.</>,
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className="text-caption text-muted-foreground mb-4">
            <EditorialArrow size={12} className="mr-2 opacity-40" />
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            A van. A photographer. You.
          </h2>
        </motion.div>

        {/* 3-step grid — clean editorial layout */}
        <hr className="rule mb-12" />
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <span className="text-caption text-muted-foreground block mb-4">{step.number}</span>
              <h3 className="font-display text-xl font-medium mb-3">
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
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-32"
        >
          <hr className="rule mb-12" />
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-caption text-muted-foreground mb-6">
                Support included
              </p>
              <ul className="space-y-3 text-sm text-foreground">
                <li>— Van with driver. 24 hours.</li>
                <li>— Photographer. All day.</li>
                <li>— Food. Water. Coffee.</li>
                <li>— Photos after. Your name in the book.</li>
              </ul>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-6">
                Participation fee
              </p>
              <div className="space-y-2 text-sm text-foreground">
                <p>€699 for 1 person</p>
                <p>€999 for 2 people</p>
                <p>€1299 for 3 or more</p>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Covers crew, fuel, lodging, <Link to="/photographers" className="underline underline-offset-4 hover:text-foreground transition-colors">photographer</Link>, food.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
