import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const BookSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="book" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Left: Book image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-coast-stone overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80" 
                alt="The Book"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            {/* Floating label */}
            <div className="absolute -bottom-6 -right-6 md:-right-12 bg-accent text-accent-foreground px-6 py-4">
              <p className="font-display text-sm font-medium">Volume III</p>
              <p className="text-xs opacity-70">Coming 2025</p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm text-white/50 tracking-wide mb-4">The Books</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-8">
              Visual documentation.
            </h2>
            
            <p className="text-lg text-white/70 leading-relaxed mb-6">
              Photographs from each stage. Harbors, coastlines, 
              weather, terrain. Collected and printed.
            </p>

            <p className="text-lg text-white/70 leading-relaxed mb-10">
              Volume I: Knokke to San Sebastián
              <br />
              Volume II: San Sebastián to Gibraltar
              <br />
              Volume III: Gibraltar to Monaco
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#" 
                className="inline-flex items-center justify-center gap-2 border border-white/30 px-6 py-4 text-white hover:bg-white hover:text-black transition-all"
              >
                <span className="font-display font-medium">Order</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};