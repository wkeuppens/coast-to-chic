import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import coastalPath from '@/assets/coastal-path.jpg';
import supportVictus from '@/assets/support-victus.jpg';
import supportSunsetBeer from '@/assets/support-sunset-beer.jpg';
import supportCoastalVan from '@/assets/support-coastal-van.jpg';
import supportDuvelFlag from '@/assets/support-duvel-flag.jpg';
import supportVictusPack from '@/assets/support-victus-pack.jpg';
import supportNightBeers from '@/assets/support-night-beers.jpg';
import { api } from '@/lib/apiClient';

function PartnerForm() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      await api.post('/api/contact', {
        name: form.name,
        email: form.email,
        subject: `Partnership enquiry — ${form.company}`,
        message: form.message,
      });
      setDone(true);
    } catch {
      setError('Something went wrong. Email us directly at hello@followthecoast.com');
    } finally { setSubmitting(false); }
  };

  if (done) return (
    <p className="text-sm text-foreground py-8">
      Message received. We'll be in touch.
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Your name" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
        <input type="text" placeholder="Company / brand" value={form.company}
          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          className="border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
      </div>
      <input type="email" placeholder="Email address" required value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
      <textarea placeholder="Tell us about your brand and what kind of partnership you have in mind" required value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        rows={5}
        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" disabled={submitting}
        className="bg-accent text-white text-sm px-8 py-3 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50">
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SectionWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeIn}
      transition={{ duration: 0.8 }}
      className={`py-16 md:py-24 px-6 md:px-12 lg:px-24 ${className}`}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </motion.section>
  );
};

const supportImages = [
  { src: supportCoastalVan, alt: 'Van on a coastal cliff path' },
  { src: supportDuvelFlag, alt: 'Duvel flag at sunset' },
  { src: supportVictusPack, alt: 'Runner with Victus nutrition pack' },
  { src: supportVictus, alt: 'Runner fueling with Victus nutrition' },
  { src: supportSunsetBeer, alt: 'Sunset celebration after a stage' },
  { src: supportNightBeers, alt: 'Runner celebrating with beers at night' },
];

const partnershipModes = [
  { title: 'Project Partner', text: 'Support the long-term mission. Your name travels with the project across borders and years.' },
  { title: 'Stage Partner', text: 'Adopt a specific stage. Be connected to a stretch of coastline, a runner, and a story.' },
  { title: 'Equipment & Logistics', text: 'Provide what keeps the crew moving — vehicles, gear, food, or local infrastructure.' },
];

const partners = ['Duvel', 'Victus', 'D\'Ieteren'];

const SupportTheProject = () => {
  return (
    <>
      <SEO title="Support the Project" description="Support the long-term journey around Europe's coastline. Discover how partners help Follow the Coast move forward." path="/support" />
      <main className="overflow-x-hidden overflow-y-auto">
        <Navigation />

        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-end">
          <div className="absolute inset-0">
            <img src={coastalPath} alt="Coastal path along Europe's shoreline" className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>
          <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-16 md:pb-24 max-w-4xl">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-caption text-primary-foreground/60 mb-4">Support</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-4xl md:text-6xl text-primary-foreground mb-4">
              Carry the coastline<br className="hidden md:inline" /> with us
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-primary-foreground/80 text-lg max-w-xl leading-relaxed">
              Follow the Coast continues thanks to partners who believe in documenting something slowly, over many years.
            </motion.p>
          </div>
        </section>

        {/* Image grid */}
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {supportImages.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.08 }} className="aspect-[4/3] overflow-hidden">
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Current partners */}
        <SectionWrapper className="border-t border-border">
          <p className="text-caption text-accent mb-6">Current partners</p>
          <div className="flex flex-wrap gap-12 md:gap-16">
            {partners.map((partner) => (
              <span key={partner} className="text-2xl md:text-3xl text-foreground">{partner}</span>
            ))}
          </div>
        </SectionWrapper>

        {/* Partnership modes */}
        <SectionWrapper className="bg-secondary">
          <p className="text-caption text-accent mb-4">Partnership</p>
          <h2 className="text-2xl md:text-3xl mb-12">Ways to support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {partnershipModes.map((mode) => (
              <div key={mode.title} className="bg-background p-8">
                <h3 className="text-lg font-medium mb-3">{mode.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{mode.text}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* How we work */}
        <SectionWrapper>
          <p className="text-caption text-muted-foreground mb-4">Approach</p>
          <h2 className="text-2xl md:text-3xl mb-6">How we work</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Every collaboration finds its own form.
              Partners support a project connecting coastlines, people and stories.
              The project speaks for itself.
          </p>
        </SectionWrapper>

        {/* Contact */}
        <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
          <div className="max-w-2xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-2xl md:text-4xl mb-4">
              Start the conversation
            </motion.h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Every partnership finds its own form. Tell us about your brand and what you're looking for.
            </p>
            <PartnerForm />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default SupportTheProject;
