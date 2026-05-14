import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { EditorialArrow } from '@/components/EditorialArrow';
import { SEO } from '@/components/SEO';
import { prints as printsApi, checkout, type ApiPrint } from '@/lib/api';

// Placeholder prints while API loads / if API returns nothing
const PLACEHOLDER_PRINTS: ApiPrint[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  slug: `print-${i + 1}`,
  title: 'Coastal Dawn',
  stageNumber: null,
  imageUrl: '/placeholder.svg',
  priceEur: 195,
  dimensions: '50×70cm',
  editionSize: 11,
  available: true,
}));

function PrintCheckout({ print, onClose }: { print: ApiPrint; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await checkout.print({
        printId: print.id,
        printTitle: print.title,
        priceEur: print.priceEur,
        customerEmail: form.email,
      });
      if (res.paymentUrl) window.location.href = res.paymentUrl;
      else setError(res.error ?? 'Something went wrong.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-border pt-6">
      <p className="text-caption text-muted-foreground">Order this print — €{print.priceEur}</p>
      <input type="text" placeholder="Your name" required value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
      <input type="email" placeholder="Email address" required value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={submitting}
          className="bg-accent text-white text-caption px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50">
          {submitting ? 'Processing…' : `Order — €${print.priceEur}`}
        </button>
        <button type="button" onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}

const Prints = () => {
  const [allPrints, setAllPrints] = useState<ApiPrint[]>(PLACEHOLDER_PRINTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orderingId, setOrderingId] = useState<string | null>(null);

  useEffect(() => {
    printsApi.list().then(data => { if (data.length > 0) setAllPrints(data); }).catch(() => {});
  }, []);

  const currentIndex = selectedId ? allPrints.findIndex(p => p.id === selectedId) : -1;
  const navigate = (dir: 1 | -1) => {
    const next = (currentIndex + dir + allPrints.length) % allPrints.length;
    setSelectedId(allPrints[next].id);
    setOrderingId(null);
  };
  const selected = allPrints.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Prints" description="Limited edition prints from Follow the Coast photographers. Museum-quality paper." path="/prints" />
      <Navigation />

      <section className="pt-32 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-caption text-accent mb-4">Limited Editions</p>
          <h1 className="text-4xl md:text-6xl tracking-tight mt-2 mb-8">From the archive</h1>
          <div className="space-y-4 max-w-xl">
            <p className="text-muted-foreground leading-relaxed">
              Each stage along the coastline is documented by a photographer. These prints are selected from that archive.
              Museum-quality paper. Edition of 11.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {allPrints.filter(p => p.available).map((print, i) => (
            <motion.button
              key={print.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={() => { setSelectedId(print.id); setOrderingId(null); }}
              className="text-left group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary mb-3">
                <img src={print.imageUrl ?? '/placeholder.svg'} alt={print.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
              </div>
              <p className="text-sm">{print.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{print.dimensions} · Ed. {print.editionSize} · €{print.priceEur}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col"
            onClick={() => setSelectedId(null)}>
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{selected.title}</p>
                <p className="text-sm">{selected.dimensions} · Edition of {selected.editionSize}</p>
              </div>
              <button onClick={() => setSelectedId(null)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-16 relative" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between absolute inset-x-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors pointer-events-auto">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => navigate(1)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors pointer-events-auto">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="max-w-md w-full">
                <img src={selected.imageUrl ?? '/placeholder.svg'} alt={selected.title}
                  className="w-full aspect-[3/4] object-cover mb-6" />

                {orderingId === selected.id ? (
                  <PrintCheckout print={selected} onClose={() => setOrderingId(null)} />
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{selected.title}</p>
                      <p className="text-xs text-muted-foreground">€{selected.priceEur}</p>
                    </div>
                    <button onClick={() => setOrderingId(selected.id)}
                      className="bg-accent text-white text-caption px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity">
                      Order this print
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prints;
