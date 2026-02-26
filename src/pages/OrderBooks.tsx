import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import wavesLogo from '@/assets/waves-logo.png';
import bookMockup from '@/assets/book-mockup.jpg';
import { SEO } from '@/components/SEO';

const books = [
  {
    id: 1,
    title: 'Volume I',
    subtitle: 'Knokke — San Sebastián',
    price: '€55',
    status: 'available' as const,
  },
  {
    id: 2,
    title: 'Volume II',
    subtitle: 'San Sebastián — Gibraltar',
    price: '€55',
    status: 'available' as const,
  },
  {
    id: 3,
    title: 'Volume III',
    subtitle: 'Gibraltar — Monaco',
    price: '€55',
    status: 'coming' as const,
  },
];

const OrderBooks = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Order Books"
        description="Follow the Coast photo books. 5,000 km per volume. Photos, routes, and field notes. Free shipping across Europe."
        path="/order-books"
      />
      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto brightness-0" />
          <span className="font-display text-[10px] font-bold uppercase tracking-wider leading-tight">
            <span className="block">Follow</span>
            <span className="block">The</span>
            <span className="block">Coast</span>
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </header>

      {/* Books grid — show, don't describe */}
      <section className="px-6 md:px-12 lg:px-24 pt-12 pb-24 md:pt-20 md:pb-40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-muted-foreground tracking-wide mb-4">The books</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] mb-4">
              5,000 km per volume.
            </h1>
            <p className="text-muted-foreground max-w-md">
              Photos. Routes. Field notes. Free shipping across Europe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group"
              >
                {/* Cover image — primary visual */}
                <div className="aspect-[4/5] overflow-hidden rounded-sm mb-5 bg-secondary">
                  <img
                    src={bookMockup}
                    alt={`Follow the Coast ${book.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Minimal info */}
                <h3 className="font-display text-xl font-medium mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{book.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">{book.price}</span>
                  {book.status === 'available' ? (
                    <Link
                      to={`/checkout?product=Book%20%E2%80%93%20${encodeURIComponent(book.title)}&variant=${encodeURIComponent(book.subtitle)}&price=${encodeURIComponent(book.price)}&return=/order-books`}
                      className="bg-accent text-accent-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Order
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">Coming 2026</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bundle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border border-accent/30 bg-accent/5 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold mb-1">Bundle: Volume I + II</h3>
              <p className="text-sm text-muted-foreground">Save €15 — both volumes together.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-sm text-muted-foreground line-through">€110</span>
                <span className="font-display text-3xl font-bold ml-3">€95</span>
              </div>
              <Link
                to="/checkout?product=Book%20Bundle&variant=Volume%20I%20%2B%20II&price=%E2%82%AC95&return=/order-books"
                className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Order bundle
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OrderBooks;
