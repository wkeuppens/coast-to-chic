import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import runningMotion from '@/assets/running-motion.jpg';

const books = [
  {
    id: 1,
    title: 'Volume I',
    subtitle: 'Knokke to San Sebastián',
    status: 'Available',
  },
  {
    id: 2,
    title: 'Volume II',
    subtitle: 'San Sebastián to Gibraltar',
    status: 'Available',
  },
  {
    id: 3,
    title: 'Volume III',
    subtitle: 'Gibraltar to Monaco',
    status: 'Coming 2026',
  },
];

export const BookSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="books" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
          {/* Left: Book image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] bg-white/10 overflow-hidden">
              <img 
                src={runningMotion}
                alt="Runner in motion"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-sm text-white/50 tracking-wide mb-4">The books</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight mb-8">
              5,000 km per volume.
              <br />
              Photos. Routes. Field notes.
            </h2>
            
            <p className="text-white/70 leading-relaxed mb-8">
              Harbours. Cliff paths. Weather that changed plans.
              The stuff that happened.
            </p>

            <div className="space-y-4 mb-10">
              {books.map((book) => (
                <div key={book.id} className="flex justify-between items-baseline border-b border-white/10 pb-3">
                  <div>
                    <span className="font-display font-medium">{book.title}</span>
                    <span className="text-white/50 ml-3 text-sm">{book.subtitle}</span>
                  </div>
                  <span className="text-xs text-white/50">{book.status}</span>
                </div>
              ))}
            </div>

            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <span className="border-b border-white/30 pb-1">Order books →</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
