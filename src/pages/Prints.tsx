import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { checkout, type ApiPrint } from '@/lib/api';
import { usePrints } from '@/hooks/useSanityData';

function PrintCheckout({ print, onClose }: { print: ApiPrint; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await checkout.print({ printId: print.id, printTitle: print.title, priceEur: print.priceEur, customerEmail: form.email });
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
        <button type="button" onClick={onClose}
          className="text-caption text-muted-foreground hover:text-foreground transition-colors px-4">
          Cancel
        </button>
      </div>
      <p className="text-xs text-muted-foreground">You'll be redirected to Stripe to complete payment.</p>
    </form>
  );
}

const Prints = () => {
  const { data: prints, loading } = usePrints();
  const [selected, setSelected] = useState<ApiPrint | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayPrints = prints ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Prints" description="Limited edition prints from Follow the Coast. Coastal photography in numbered editions." path="/prints" />
      <Navigation />

      <section className="pt-32 pb-12 px-page max-w-content mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Prints</p>
          <h1 className="text-3xl md:text-4xl tracking-tight mb-4">Limited editions</h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Numbered prints from the archive. Each edition is small. Once sold, gone.
          </p>
        </motion.div>
      </section>

      <section className="px-page pb-24">
        {loading ? (
          <div className="text-sm text-muted-foreground py-8">Loading…</div>
        ) : !displayPrints.length ? (
          <div className="text-sm text-muted-foreground py-8 max-w-content mx-auto">No prints available at the moment. Check back soon.</div>
        ) : (
          <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {displayPrints.map((print, i) => (
              <motion.div key={print.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                <button className="w-full text-left group" onClick={() => { setSelected(print); setLightboxIndex(null); }}>
                  <div className="aspect-[3/4] overflow-hidden bg-secondary mb-4">
                    {print.imageUrl ? (
                      <img src={print.imageUrl} alt={print.title} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.015]" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <h3 className="text-base group-hover:text-accent transition-colors duration-300">{print.title}</h3>
                  {print.stageNumber && <p className="text-caption text-muted-foreground mt-1">Stage {print.stageNumber}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-accent">€{print.priceEur}</span>
                    {print.dimensions && <span className="text-caption text-muted-foreground">{print.dimensions}</span>}
                  </div>
                  {print.editionSize && (
                    <p className="text-caption text-muted-foreground mt-1">Edition of {print.editionSize}</p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Print detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              className="bg-background border border-border max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl">{selected.title}</h2>
                  {selected.stageNumber && <p className="text-caption text-muted-foreground mt-1">Stage {selected.stageNumber}</p>}
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>
              {selected.imageUrl && (
                <div className="aspect-[3/4] overflow-hidden bg-secondary mb-6">
                  <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl text-accent">€{selected.priceEur}</span>
                <div className="text-right text-caption text-muted-foreground">
                  {selected.dimensions && <p>{selected.dimensions}</p>}
                  {selected.editionSize && <p>Edition of {selected.editionSize}</p>}
                </div>
              </div>
              <PrintCheckout print={selected} onClose={() => setSelected(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Prints;
