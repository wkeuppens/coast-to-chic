import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';
import { MagneticButton } from './MagneticButton';
import bookMockup from '@/assets/book-mockup.jpg';

export const BookSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="books" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-caption text-muted-foreground mb-4">The books</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            5,000 km per volume.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="aspect-[16/9] overflow-hidden bg-secondary">
            <img
              src={bookMockup}
              alt="Follow the Coast — Volume I and Volume II"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/order-books">
            <MagneticButton
              className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 rounded-full font-display font-medium hover:opacity-90 transition-opacity"
              strength={0.2}
            >
              <EditorialArrow size={18} className="invert" />
              Explore the books
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
