import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';
import bookMockup from '@/assets/book-mockup.jpg';

export const BookSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="books" className="py-32 md:py-48">
      <div ref={ref}>
        {/* Full-bleed book image — like a photo spread in the book */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={bookMockup}
              alt="Follow the Coast — Volume I and Volume II"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Text block below */}
        <div className="px-6 md:px-12 lg:px-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <hr className="rule mb-10" />
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-caption text-muted-foreground mb-4">
                  <EditorialArrow size={12} className="mr-2 opacity-40" />
                  The books
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  5,000 km per volume.
                </h2>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Each book documents 50 stages of coastline through photography, maps, and runner stories.
                  Art directed by Marcus Brown. Published by Lannoo.
                </p>
                <Link
                  to="/order-books"
                  className="inline-flex items-center gap-2 text-sm font-display uppercase tracking-wider hover:opacity-60 transition-opacity self-start"
                >
                  <EditorialArrow size={14} />
                  Explore the books
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
