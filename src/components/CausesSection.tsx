import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const causes = [
  {
    id: '01',
    title: 'Physical',
    description: 'Research and support for people with physical disabilities. Partnerships with rehabilitation organizations.',
    icon: '◯',
  },
  {
    id: '02',
    title: 'Mental',
    description: 'Funding for suicide prevention. Mental health organizations in participating countries.',
    icon: '△',
  },
  {
    id: '03',
    title: 'Ocean',
    description: 'Beach cleanups along the route. Partnerships with coastal conservation organizations.',
    icon: '□',
  },
];

export const CausesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="causes" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-20"
        >
          <p className="text-sm text-muted-foreground tracking-wide mb-4">Causes</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground">
            Three areas of support.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0 border-t border-border">
          {causes.map((cause, index) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="border-b md:border-b-0 md:border-r border-border last:border-r-0 p-8 md:p-12 group hover:bg-secondary transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-display text-5xl text-muted-foreground/30 group-hover:text-accent transition-colors">
                  {cause.icon}
                </span>
                <span className="text-sm text-muted-foreground">{cause.id}</span>
              </div>
              
              <h3 className="font-display text-2xl font-medium text-foreground mb-4">
                {cause.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {cause.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
          >
            Learn more about our charities →
          </a>
        </motion.div>
      </div>
    </section>
  );
};