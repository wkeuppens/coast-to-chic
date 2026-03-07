import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialArrow } from './EditorialArrow';
import bookMockup from '@/assets/book-mockup.jpg';

const books = [
  { id: 1, title: 'Volume I', subtitle: 'Knokke — San Sebastián', price: '€55' },
  { id: 2, title: 'Volume II', subtitle: 'San Sebastián — Gibraltar', price: '€55' },
  { id: 3, title: 'Volume III', subtitle: 'Gibraltar — Monaco', price: 'Coming 2026' },
];

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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden mb-5 bg-secondary">
                <img
                  src={bookMockup}
                  alt={`Follow the Coast ${book.title}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-display text-lg font-medium">{book.title}</h3>
              <p className="text-caption text-muted-foreground mt-1">{book.subtitle}</p>
              <p className="font-display text-lg font-medium mt-2">{book.price}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/order-books"
            className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 rounded-full font-display font-medium hover:opacity-90 transition-opacity"
          >
            Explore the books
            <EditorialArrow size={18} className="invert" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
