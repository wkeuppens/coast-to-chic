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
    description: <>7am start. A van. A <Link to="/photographers" className="underline underline-offset-2 hover:text-foreground transition-colors">photographer</Link>. 24 hours moving.</>,
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-secondary">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Orientation layer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <p className="text-caption text-muted-foreground mb-3">
            How it works
          </p>
          <p className="text-label">
            Run one stage of Europe's coastline.
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl font-bold mb-24"
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
              <div className="mb-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <EditorialArrow size={18} className="opacity-20" />
                  <h3 className="font-display text-xl md:text-2xl font-medium">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {step.description}
                </p>
                <span className="block font-body font-black text-[10rem] md:text-[12rem] lg:text-[14rem] text-foreground/[0.03] leading-none select-none text-right mt-auto">{step.number}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support & Fee blocks */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32 grid md:grid-cols-2 gap-16 border-t border-border pt-12"
        >
          <div>
            <p className="text-caption text-muted-foreground mb-6">
              Support included
            </p>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-0.5">—</span>
                <span>Van with driver. 24 hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-0.5">—</span>
                <span>Photographer. All day.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-0.5">—</span>
                <span>Food. Water. Coffee.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-0.5">—</span>
                <span>Photos after. One book per runner.</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-caption text-muted-foreground mb-6">
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
