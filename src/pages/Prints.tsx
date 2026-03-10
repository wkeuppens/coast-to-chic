import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { EditorialArrow } from '@/components/EditorialArrow';
import { SEO } from '@/components/SEO';

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
      <SEO title="Prints" description="Limited edition prints from nine Follow the Coast photographers. Museum-quality paper. Edition of 11." path="/prints" />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-caption text-accent mb-4">Limited Editions</p>
          <h1 className="text-4xl md:text-6xl font-medium mt-2 mb-8">From the archive</h1>
          <div className="space-y-4 max-w-xl">
            <p className="text-muted-foreground leading-relaxed">Each stage along the coastline is documented by photographers who travel with the runners.</p>
            <p className="text-muted-foreground leading-relaxed">From that growing archive, a small number of images are selected and printed as limited editions.</p>
            <p className="text-foreground leading-relaxed">These are not souvenirs.<br />They are fragments of a long-term record.</p>
          </div>
        </motion.div>
      </section>

      {/* The Editions */}
      <section className="pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-caption text-accent mb-6">The Editions</h2>
        <p className="text-muted-foreground leading-relaxed max-w-xl mb-4">Each photograph is:</p>
        <ul className="space-y-1.5 max-w-xl mb-6">
          <li className="text-muted-foreground leading-relaxed"><span className="text-accent">•</span> selected by the photographer</li>
          <li className="text-muted-foreground leading-relaxed"><span className="text-accent">•</span> printed in a strictly limited run</li>
          <li className="text-muted-foreground leading-relaxed"><span className="text-accent">•</span> signed and numbered</li>
          <li className="text-muted-foreground leading-relaxed"><span className="text-accent">•</span> produced on museum-grade paper</li>
        </ul>
        <p className="text-foreground/70 leading-relaxed max-w-xl">When an edition sells out, it will not be reprinted.</p>
      </section>

      {/* Why Prints Exist */}
      <section className="pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-caption text-accent mb-6">Why Prints Exist</h2>
        <div className="space-y-4 max-w-xl">
          <p className="text-muted-foreground leading-relaxed">The archive only continues if the work behind it continues.</p>
          <p className="text-muted-foreground leading-relaxed">Each print contributes directly to the photographers documenting the journey along Europe's coastline.</p>
          <p className="text-foreground leading-relaxed">Buying a print is not simply acquiring an image.<br />It helps sustain the documentation itself.</p>
        </div>
      </section>

      {/* Priority */}
      <section className="pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-caption text-accent mb-6">Priority for Participants</h2>
        <div className="space-y-4 max-w-xl">
          <p className="text-muted-foreground leading-relaxed">If a limited edition photograph was taken during your stage, you will be given the opportunity to acquire it before it becomes publicly available.</p>
          <p className="text-muted-foreground leading-relaxed">After that, remaining prints are released to the wider community.</p>
        </div>
      </section>

      {/* Format */}
      <section className="pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-caption text-accent mb-6">Format & Shipping</h2>
        <div className="space-y-4 max-w-xl">
          <p className="text-muted-foreground leading-relaxed">Printed and packed individually.<br />Shipped carefully from Europe.</p>
          <p className="text-muted-foreground leading-relaxed">Shipping is calculated transparently at checkout.</p>
        </div>
      </section>

      {/* Acquire */}
      <section className="pb-8 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl mb-4">Acquire a print</h2>
        <div className="space-y-4 max-w-xl">
          <p className="text-muted-foreground leading-relaxed">Explore the current available editions below.</p>
          <p className="text-muted-foreground leading-relaxed">Each marks a real place, a real day, a real passage along the coast.</p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prints.map((print, i) => (
            <motion.button key={print.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }} onClick={() => setSelectedPrint(print.id)} className="group text-left cursor-pointer">
              <div className="aspect-[3/2] overflow-hidden bg-secondary mb-4">
                <img src={print.image} alt={print.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex-shrink-0">
                  <EditorialArrow size={14} />
                </div>
                <h3 className="text-base font-medium">{print.title}</h3>
              </div>
              <p className="text-caption text-muted-foreground mt-1">
                <Link to={`/photographers#photographer-${print.photographerId}`} className="hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                  {print.photographer}
                </Link>
                {' · '}{print.location}{' · '}{print.stage}
              </p>
              <p className="text-caption text-accent mt-2">Edition of 11</p>
            </motion.button>
          ))}
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setSelectedPrint(null)}>
            <button onClick={() => setSelectedPrint(null)} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10" aria-label="Close">
              <X size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="absolute left-6 text-white/40 hover:text-white transition-colors z-10" aria-label="Previous">
              <ChevronLeft size={32} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="absolute right-6 text-white/40 hover:text-white transition-colors z-10" aria-label="Next">
              <ChevronRight size={32} />
            </button>
            <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="max-w-4xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-[3/2] overflow-hidden mb-6">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-start justify-between gap-8">
                <div>
                  <h2 className="text-2xl text-white font-medium">{selected.title}</h2>
                  <p className="text-white/60 mt-1">
                    <Link to={`/photographers#photographer-${selected.photographerId}`} className="hover:text-white transition-colors" onClick={() => setSelectedPrint(null)}>
                      {selected.photographer}
                    </Link>
                    {' · '}{selected.location}{' · '}{selected.stage}
                  </p>
                  <p className="text-caption text-accent mt-2">Limited edition of 11</p>
                </div>
                <Link
                  to={`/checkout?product=Print%20%E2%80%93%20${encodeURIComponent(selected.title)}&variant=${encodeURIComponent(selected.photographer)}&price=TBD&return=/prints`}
                  className="shrink-0 text-sm font-display uppercase tracking-wider border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all"
                >
                  Order Print
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prints;
