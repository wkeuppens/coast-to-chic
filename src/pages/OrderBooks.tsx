import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import wavesLogo from '@/assets/waves-logo.png';
import bookMockup from '@/assets/book-mockup.jpg';
import bookVol2Cover from '@/assets/book-vol2-cover.jpg';
import spreadCover from '@/assets/book-spread-cover.jpg';
import spreadFrontback from '@/assets/book-spread-frontback.jpg';
import spreadHighlights from '@/assets/book-spread-highlights.jpg';
import spreadStage65 from '@/assets/book-spread-stage65.jpg';
import spreadGallery from '@/assets/book-spread-gallery.jpg';
import spreadAerial from '@/assets/book-spread-aerial.jpg';
import spreadStage54 from '@/assets/book-spread-stage54.jpg';
import spreadRegion7 from '@/assets/book-spread-region7.jpg';
import spreadRegion3 from '@/assets/book-spread-region3.jpg';
import spreadBasque from '@/assets/book-spread-basque.jpg';
import { SEO } from '@/components/SEO';

const books = [
  { id: 1, title: 'Volume I', subtitle: 'Knokke — San Sebastián', price: '€55', status: 'available' as const, image: bookMockup },
  { id: 2, title: 'Volume II', subtitle: 'San Sebastián — Gibraltar', price: '€55', status: 'available' as const, image: bookVol2Cover },
  { id: 3, title: 'Volume III', subtitle: 'Gibraltar — Monaco', price: '€55', status: 'coming' as const, image: bookMockup },
];

const spreads = [
  { src: spreadFrontback, alt: 'Front and back cover' },
  { src: spreadStage54, alt: 'Stage 54 spread' },
  { src: spreadCover, alt: 'Book cover mockup' },
  { src: spreadGallery, alt: 'Photo gallery spread' },
  { src: spreadRegion7, alt: 'Region 7 — Lisbon spread' },
  { src: spreadBasque, alt: 'Basque Country highlights' },
  { src: spreadAerial, alt: 'Aerial coastal spread' },
  { src: spreadHighlights, alt: 'Stage highlights spread' },
  { src: spreadRegion3, alt: 'Region 3 — Asturias spread' },
  { src: spreadStage65, alt: 'Stage 65 lighthouse spread' },
];

const BookSpreads = () => {
  const [current, setCurrent] = useState(0);
  const canPrev = current > 0;
  const canNext = current < spreads.length - 1;

  return (
    <div className="relative">
      <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-secondary relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={spreads[current].src}
            alt={spreads[current].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => canPrev && setCurrent(c => c - 1)}
            className={`w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity ${canPrev ? 'opacity-100 hover:bg-background' : 'opacity-0 pointer-events-none'}`}
            aria-label="Previous spread"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => canNext && setCurrent(c => c + 1)}
            className={`w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity ${canNext ? 'opacity-100 hover:bg-background' : 'opacity-0 pointer-events-none'}`}
            aria-label="Next spread"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {spreads.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 transition-colors ${i === current ? 'bg-foreground' : 'bg-border'}`}
            aria-label={`View spread ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const OrderBooks = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Order Books" description="Follow the Coast photo books. 5,000 km per volume. Photos, routes, and field notes. Free shipping across Europe." path="/order-books" />
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto brightness-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">
            <span className="block">Follow</span>
            <span className="block">The</span>
            <span className="block">Coast</span>
          </span>
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </header>

      <section className="px-6 md:px-12 lg:px-24 pt-12 pb-24 md:pt-20 md:pb-40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-caption text-muted-foreground mb-4">The books</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.05] mb-4">
              5,000 km per volume.
            </h1>
            <p className="text-muted-foreground max-w-md">
              Photos. Routes. Field notes. Free shipping across Europe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group"
              >
                {book.status === 'available' ? (
                  <Link to={`/checkout?product=Book%20%E2%80%93%20${encodeURIComponent(book.title)}&variant=${encodeURIComponent(book.subtitle)}&price=${encodeURIComponent(book.price)}&return=/order-books`} className="block">
                    <div className="aspect-[4/5] overflow-hidden bg-secondary">
                      <img
                        src={book.image}
                        alt={`Follow the Coast ${book.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img
                      src={book.image}
                      alt={`Follow the Coast ${book.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="pt-5 text-center">
                  <p className="text-caption text-muted-foreground mb-2">
                    {book.status === 'available' ? book.subtitle : 'Coming 2026'}
                  </p>
                  <h3 className="text-base font-semibold mb-1">{book.title}</h3>
                  <p className="text-base">{book.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Look Inside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-24"
          >
            <p className="text-caption text-muted-foreground mb-8">Look inside</p>
            <BookSpreads />
          </motion.div>

          {/* Bundle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border border-accent/30 bg-accent/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold mb-1">Bundle: Volume I + II</h3>
              <p className="text-caption text-muted-foreground">Save €15 — both volumes together.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-sm text-muted-foreground line-through">€110</span>
                <span className="font-display text-3xl font-bold ml-3">€95</span>
              </div>
              <Link to="/checkout?product=Book%20Bundle&variant=Volume%20I%20%2B%20II&price=%E2%82%AC95&return=/order-books">
                <MagneticButton className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap" strength={0.2}>
                  <EditorialArrow size={14} className="invert" />
                  Order bundle
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OrderBooks;
