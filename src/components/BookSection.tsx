import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import bookMockup from '@/assets/book-mockup.jpg';

/**
 * The books — full-bleed image + quiet text below.
 * Like encountering a photographic plate in a gallery.
 */
export const BookSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="books" ref={ref}>
      {/* Full-bleed book photograph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
          <img
            src={bookMockup}
            alt="Follow the Coast — Volume I and Volume II"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Text below — restrained */}
      <div className="px-page py-section">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-content mx-auto"
        >
          <hr className="rule mb-8" />
          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            <div>
              <p className="text-label mb-element">The books</p>
              <h2 className="text-2xl md:text-3xl tracking-tight">
                5,000 km per volume
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-text">
                Each book documents 50 stages of coastline through photography, 
                maps, and runner stories. Art directed by Marcus Brown. Published by Lannoo.
              </p>
              <Link
                to="/order-books"
                className="text-caption text-foreground hover:text-muted-foreground transition-colors self-start"
              >
                Explore the books →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
