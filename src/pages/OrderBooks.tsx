import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import wavesLogo from '@/assets/waves-logo.png';
import bookMockup from '@/assets/book-mockup.jpg';
import { SEO } from '@/components/SEO';

const books = [
  {
    id: 1,
    title: 'Volume I',
    subtitle: 'Knokke to San Sebastián',
    description: 'The Atlantic coast. Belgium, France, and the Basque Country. 5,000 km of harbours, dunes, and cliff paths.',
    price: '€45',
    status: 'available' as const,
  },
  {
    id: 2,
    title: 'Volume II',
    subtitle: 'San Sebastián to Gibraltar',
    description: 'The Iberian coast. Spain and Portugal. Sun-baked fishing villages and endless ocean roads.',
    price: '€45',
    status: 'available' as const,
  },
  {
    id: 3,
    title: 'Volume III',
    subtitle: 'Gibraltar to Monaco',
    description: 'The Mediterranean. North Africa, southern Spain, and the French Riviera.',
    price: '€45',
    status: 'coming' as const,
  },
];

const includes = [
  'HD photographs from the journey',
  'Detailed route maps & elevation profiles',
  'Field notes and stories from the road',
  'Runner tips for every section',
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

      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-24 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm text-muted-foreground tracking-wide mb-4">The books</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              5,000 km<br />per volume.
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-8">
              Photos. Routes. Field notes. The stuff that happened between the start and the finish line — harbours, cliff paths, weather that changed plans.
            </p>
            <div className="space-y-3 mb-10">
              {includes.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-accent shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={bookMockup}
                alt="Follow the Coast book"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Books grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="border border-border rounded-2xl p-8 flex flex-col"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                  {book.status === 'available' ? 'Available now' : 'Coming 2026'}
                </p>
                <h3 className="font-display text-2xl font-bold mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{book.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-8">
                  {book.description}
                </p>
                <div className="flex items-end justify-between">
                  <span className="font-display text-3xl font-bold">{book.price}</span>
                  {book.status === 'available' ? (
                    <Link to={`/checkout?product=Book%20%E2%80%93%20${encodeURIComponent(book.title)}&variant=${encodeURIComponent(book.subtitle)}&price=${encodeURIComponent(book.price)}&return=/order-books`} className="bg-accent text-accent-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      Order now
                    </Link>
                  ) : (
                    <button className="border border-border text-muted-foreground px-6 py-3 rounded-full text-sm font-medium cursor-not-allowed opacity-60">
                      Notify me
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bundle CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 border border-accent/30 bg-accent/5 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold mb-2">Bundle: Volume I + II</h3>
              <p className="text-sm text-muted-foreground">
                Save €15 when you order both available volumes together.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-sm text-muted-foreground line-through">€90</span>
                <span className="font-display text-3xl font-bold ml-3">€75</span>
              </div>
              <Link to="/checkout?product=Book%20Bundle&variant=Volume%20I%20%2B%20II&price=%E2%82%AC75&return=/order-books" className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                Order bundle
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer note */}
      <section className="bg-foreground text-primary-foreground px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-white/50 tracking-wide mb-4">Shipping</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
            Free shipping across Europe.
          </h2>
          <p className="text-white/60 leading-relaxed mb-8">
            Orders ship within 5 business days. Worldwide shipping available at checkout. Each book is carefully packed and shipped with a tracking number.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="border-b border-white/30 pb-1">Back to home</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrderBooks;
