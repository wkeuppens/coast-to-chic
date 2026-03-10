import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Globe } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export const photographers = [
  { id: 1, name: 'Photographer 1', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 2, name: 'Photographer 2', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 3, name: 'Photographer 3', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 4, name: 'Photographer 4', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 5, name: 'Photographer 5', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 6, name: 'Photographer 6', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 7, name: 'Photographer 7', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 8, name: 'Photographer 8', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
  { id: 9, name: 'Photographer 9', bio: 'Bio coming soon.', photo: '/placeholder.svg', website: '#', instagram: '#' },
];

const Photographers = () => {
  const shuffled = useMemo(() => [...photographers].sort(() => Math.random() - 0.5), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Photographers" description="Nine photographers documenting Follow the Coast. Every kilometre, every stage." path="/photographers" />
      <Navigation />

      <section className="pt-32 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-caption text-muted-foreground mb-4">The Team</p>
          <h1 className="text-4xl md:text-6xl font-medium mt-2 mb-6">Photographers</h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Nine photographers documenting every kilometre of Follow The Coast. Each contributing a unique perspective to the project.
          </p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {shuffled.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }} id={`photographer-${p.id}`}>
              <div className="aspect-[3/4] overflow-hidden bg-secondary mb-5">
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-display text-lg font-medium">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.bio}</p>
              <div className="flex items-center gap-4 mt-4">
                <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${p.name} website`}>
                  <Globe size={16} />
                </a>
                <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${p.name} Instagram`}>
                  <Instagram size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Photographers;
