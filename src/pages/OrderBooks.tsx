import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import { SEO } from '@/components/SEO';
import { checkout } from '@/lib/api';
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

type BookId = 'book_1' | 'book_2' | 'book_3';

const BOOKS: { id: BookId; volume: string; subtitle: string; image: any; available: boolean; availableFrom?: string }[] = [
  { id: 'book_1', volume: 'Volume I', subtitle: 'Knokke — San Sebastián', image: bookMockup, available: true },
  { id: 'book_2', volume: 'Volume II', subtitle: 'San Sebastián — Gibraltar', image: bookVol2Cover, available: true },
  { id: 'book_3', volume: 'Volume III', subtitle: 'Gibraltar — Monaco', image: bookMockup, available: false, availableFrom: 'July 20' },
];

const EU_COUNTRIES = [
  { code: 'BE', name: 'Belgium' }, { code: 'NL', name: 'Netherlands' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' }, { code: 'PT', name: 'Portugal' },
  { code: 'CH', name: 'Switzerland' }, { code: 'AT', name: 'Austria' },
  { code: 'DK', name: 'Denmark' }, { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' }, { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' }, { code: 'IE', name: 'Ireland' },
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

const TIER_PRICES: Record<number, number> = { 1: 65, 2: 109, 3: 149 };
const SHIPPING: Record<string, { single: number; bundle: number }> = {
  BE: { single: 12, bundle: 24 },
  EU: { single: 29, bundle: 58 },
};

const BookSpreads = () => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative">
      <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-secondary relative">
        <AnimatePresence mode="wait">
          <motion.img key={current} src={spreads[current].src} alt={spreads[current].alt}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }} className="w-full h-full object-contain" />
        </AnimatePresence>
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6">
          <button onClick={() => current > 0 && setCurrent(c => c - 1)} disabled={current === 0}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors disabled:opacity-30">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => current < spreads.length - 1 && setCurrent(c => c + 1)} disabled={current === spreads.length - 1}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors disabled:opacity-30">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3 tabular-nums">{current + 1} / {spreads.length}</p>
    </div>
  );
};

const OrderBooks = () => {
  const [selected, setSelected] = useState<BookId[]>([]);
  const [addCanary, setAddCanary] = useState(false);
  const [countryCode, setCountryCode] = useState('BE');
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleBook = (id: BookId) => {
    const book = BOOKS.find(b => b.id === id);
    if (!book?.available) return; // Can't select unavailable books
    setSelected(s => s.includes(id) ? s.filter(b => b !== id) : [...s, id]);
  };

  const booksTotal = TIER_PRICES[selected.length] ?? 0;
  const shipping = (() => {
    if (selected.length === 0 && !addCanary) return 0;
    const rates = countryCode === 'BE' ? SHIPPING.BE : SHIPPING.EU;
    return selected.length >= 2 ? rates.bundle : rates.single;
  })();
  const total = booksTotal + (addCanary ? 25 : 0) + (selected.length > 0 || addCanary ? shipping : 0);

  const discountLabel = selected.length === 2 ? 'Save 16%' : selected.length === 3 ? 'Save 24%' : '';
  const nudge = selected.length === 0 ? null
    : selected.length === 1 ? 'Add a second book to save 16%. All three: €149.'
    : selected.length === 2 ? 'Add a third book to save 24% — €149 for all three.'
    : null;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0 && !addCanary) { setError('Select at least one book.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await checkout.books({
        selectedBooks: selected,
        addCanaryIslands: addCanary,
        countryCode,
        customerEmail: form.email,
        customerName: form.name,
      });
      if (res.paymentUrl) window.location.href = res.paymentUrl;
      else setError(res.error ?? 'Something went wrong.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Order books" description="Order Follow the Coast books. Volumes I, II and III documenting Europe's coastline stage by stage." path="/order-books" />

      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="Follow the Coast logo" className="h-8 w-auto brightness-0" />
          <span className="text-[10px] uppercase tracking-wider leading-tight">
            <span className="block">Follow</span><span className="block">The</span><span className="block">Coast</span>
          </span>
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /><span>Back</span>
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="text-caption text-accent mb-3">The books</p>
          <h1 className="text-4xl md:text-5xl tracking-tight mb-4">Follow the Coast</h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Three volumes documenting the coastline of Europe, stage by stage. Each book covers one arc of the route — photography, stage maps, and the stories that don't fit on a screen.
          </p>
        </motion.div>

        {/* Spreads */}
        <div className="mb-16">
          <BookSpreads />
        </div>

        {/* Order form */}
        <form onSubmit={handleOrder} className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Left: selection */}
          <div className="space-y-6">
            <div>
              <p className="text-caption text-muted-foreground mb-4">Select books</p>
              <div className="space-y-2">
                {BOOKS.map(book => {
                  const isSelected = selected.includes(book.id);
                  return (
                    <button type="button" key={book.id}
                      onClick={() => toggleBook(book.id)}
                      disabled={!book.available}
                      className={`w-full text-left flex items-center gap-4 p-4 border transition-colors ${
                        !book.available ? 'border-border opacity-50 cursor-not-allowed'
                        : isSelected ? 'border-foreground bg-secondary/50'
                        : 'border-border hover:border-foreground/40'
                      }`}>
                      <img src={book.image} alt={book.volume} className="w-12 h-16 object-cover shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{book.volume}</p>
                        <p className="text-xs text-muted-foreground">{book.subtitle}</p>
                        {!book.available && book.availableFrom && (
                          <p className="text-xs text-accent mt-1">Available {book.availableFrom}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">€65</span>
                        {book.available && (
                          <div className={`w-4 h-4 border flex items-center justify-center ${isSelected ? 'bg-foreground border-foreground' : 'border-border'}`}>
                            {isSelected && <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Canary add-on */}
                <button type="button" onClick={() => setAddCanary(a => !a)}
                  className={`w-full text-left flex items-center justify-between p-4 border transition-colors ${addCanary ? 'border-foreground bg-secondary/50' : 'border-border hover:border-foreground/40'}`}>
                  <div>
                    <p className="text-sm font-medium">Canary Islands — Special edition</p>
                    <p className="text-xs text-muted-foreground">Island arc outside the main series</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">€25</span>
                    <div className={`w-4 h-4 border flex items-center justify-center ${addCanary ? 'bg-foreground border-foreground' : 'border-border'}`}>
                      {addCanary && <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </div>
                </button>
              </div>

              {discountLabel && <p className="text-xs text-accent mt-3">{discountLabel} applied</p>}
              {nudge && <p className="text-xs text-muted-foreground mt-3">{nudge}</p>}
            </div>

            {/* Shipping country */}
            {(selected.length > 0 || addCanary) && (
              <div>
                <p className="text-caption text-muted-foreground mb-3">Ship to</p>
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                  className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground appearance-none">
                  {EU_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
                <p className="text-xs text-muted-foreground mt-2">Shipping: €{shipping}</p>
              </div>
            )}
          </div>

          {/* Right: summary + checkout */}
          <div className="space-y-6">
            {(selected.length > 0 || addCanary) && (
              <div className="border border-border p-6 space-y-3">
                <p className="text-caption text-muted-foreground mb-4">Order summary</p>
                {selected.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{selected.length} {selected.length === 1 ? 'book' : 'books'}{discountLabel ? ` (${discountLabel})` : ''}</span>
                    <span>€{booksTotal}</span>
                  </div>
                )}
                {addCanary && (
                  <div className="flex justify-between text-sm">
                    <span>Canary Islands</span><span>€25</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span><span>€{shipping}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-3 border-t border-border">
                  <span>Total</span><span>€{total}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-caption text-muted-foreground">Your details</p>
              <input type="text" placeholder="Full name" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
              <input type="email" placeholder="Email address" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button type="submit"
              disabled={submitting || (selected.length === 0 && !addCanary)}
              className="w-full bg-accent text-white text-caption py-4 rounded-full hover:opacity-80 transition-opacity disabled:opacity-40">
              {submitting ? 'Redirecting to payment…' : selected.length === 0 && !addCanary ? 'Select a book to continue' : `Order — €${total}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderBooks;
