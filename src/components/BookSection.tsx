import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
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
              <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />The books</p>
              <h2 className="text-2xl md:text-3xl tracking-tight">
                5,000 km per volume
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <MagneticButton
                href="/order-books"
                className="inline-flex items-center justify-center bg-accent text-accent-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-80 transition-opacity"
              >
                Explore the books
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
