import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const prints = [
  { id: 1, photographer: 'Photographer 1', photographerId: 1, title: 'Coastal Dawn', location: 'Portugal', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 2, photographer: 'Photographer 2', photographerId: 2, title: 'Salt & Stone', location: 'Spain', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 3, photographer: 'Photographer 3', photographerId: 3, title: 'The Long Way', location: 'France', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 4, photographer: 'Photographer 4', photographerId: 4, title: 'Harbour Light', location: 'Italy', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 5, photographer: 'Photographer 5', photographerId: 5, title: 'Cliff Edge', location: 'Croatia', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 6, photographer: 'Photographer 6', photographerId: 6, title: 'Morning Tide', location: 'Greece', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 7, photographer: 'Photographer 7', photographerId: 7, title: 'Dust Road', location: 'Turkey', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 8, photographer: 'Photographer 8', photographerId: 8, title: 'Open Water', location: 'Belgium', stage: 'Stage TBD', image: '/placeholder.svg' },
  { id: 9, photographer: 'Photographer 9', photographerId: 9, title: 'Last Light', location: 'Netherlands', stage: 'Stage TBD', image: '/placeholder.svg' },
];

const Prints = () => {
  const [selectedPrint, setSelectedPrint] = useState<number | null>(null);

  const currentIndex = selectedPrint !== null ? prints.findIndex(p => p.id === selectedPrint) : -1;

  const navigate = (dir: 1 | -1) => {
    const next = (currentIndex + dir + prints.length) % prints.length;
    setSelectedPrint(prints[next].id);
  };

  const selected = prints.find(p => p.id === selectedPrint);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-display">
            Limited Edition
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-medium mt-4 mb-6">
            Prints
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Nine photographs by nine contributing photographers.
            Museum-quality paper. Limited edition of 11 per print.
            Each comes with a signed certificate of authenticity.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prints.map((print, i) => (
            <motion.button
              key={print.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setSelectedPrint(print.id)}
              className="group text-left cursor-pointer"
            >
              <div className="aspect-[3/2] overflow-hidden bg-secondary rounded-sm mb-4">
                <img
                  src={print.image}
                  alt={print.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-base font-medium">{print.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <Link to={`/photographers#photographer-${print.photographerId}`} className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                  {print.photographer}
                </Link>
                {' · '}{print.location}{' · '}{print.stage}
              </p>
              <p className="text-xs text-accent mt-2 font-display uppercase tracking-wider">
                Edition of 11
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Info band */}
      <section className="border-t border-border py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider mb-3">Museum Quality</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Printed on Hahnemühle Photo Rag 308gsm archival paper with pigment-based inks rated for 200+ years.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider mb-3">Limited Edition</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each photograph is limited to 11 prints worldwide. Once sold out, the edition closes permanently.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider mb-3">Certificate</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every print ships with a signed certificate of authenticity noting the edition number and photographer.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedPrint(null)}
          >
            <button
              onClick={() => setSelectedPrint(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-6 text-white/40 hover:text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-6 text-white/40 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[3/2] overflow-hidden rounded-sm mb-6">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-8">
                <div>
                  <h2 className="font-display text-2xl text-white font-medium">{selected.title}</h2>
                  <p className="text-white/60 mt-1">
                    <Link to={`/photographers#photographer-${selected.photographerId}`} className="hover:text-white transition-colors" onClick={() => setSelectedPrint(null)}>
                      {selected.photographer}
                    </Link>
                    {' · '}{selected.location}{' · '}{selected.stage}
                  </p>
                  <p className="text-accent text-sm mt-2 font-display uppercase tracking-wider">
                    Limited edition of 11
                  </p>
                </div>
                <a
                  href="#"
                  className="shrink-0 text-sm font-display uppercase tracking-wider border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all"
                >
                  Order Print
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prints;
