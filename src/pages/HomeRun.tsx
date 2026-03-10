import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import harborBoats from '@/assets/harbor-boats.jpg';

const inclusions = [
  'Fixed GPX route prepared for your device',
  'Food, drinks and checkpoints every 15 km',
  'Transport for your personal pack',
  'Easy start and return near Venice',
  'Informal gathering after the run',
  'Community lunch the following day',
  'Your name included in the Follow the Coast book as Shoreholder',
];

const timeline = [
  { step: '1', text: 'You are added to the Home Run WhatsApp group' },
  { step: '2', text: 'You receive the GPX route' },
  { step: '3', text: 'Checkpoint locations and logistics follow' },
  { step: '4', text: 'Meet at 07:00 at the Venice bridge' },
  { step: '5', text: 'Informal drinks together that evening' },
  { step: '6', text: 'Community lunch — 21 April' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7 },
};

const HomeRun = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Home Run Venice" description="Shared 100km stage near Venice. €199 including checkpoints, community, and your name in the book. 20 April 2026." path="/homerun" />
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img src={harborBoats} alt="Venice waterfront" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-16 max-w-4xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-caption text-white/60 mb-4">
            Side route · Venice
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.95]">
            Home Run
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/70 text-lg mt-4 max-w-xl">
            A shared 100km stage.
          </motion.p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { icon: Calendar, label: 'Date', value: '20 April 2026' },
            { icon: MapPin, label: 'Start', value: 'Venice Bridge' },
            { icon: Clock, label: 'Distance', value: '100 km' },
            { icon: Users, label: 'Price', value: '€199' },
          ].map((fact) => (
            <div key={fact.label} className="px-6 py-6 text-center">
              <fact.icon className="w-4 h-4 mx-auto mb-2 text-accent" />
              <p className="text-caption text-muted-foreground mb-1">{fact.label}</p>
              <p className="text-base font-medium">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Concept */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-caption text-muted-foreground mb-4">The concept</p>
            <h2 className="text-3xl md:text-4xl font-medium mb-8">What is a Home Run?</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>A Home Run allows more runners to carry the coastline together for a single day.</p>
              <p>Start and finish are close to Venice. You run alongside others, each at their own rhythm. Checkpoints every 15 km provide food, drinks, and support.</p>
              <p>A lighter way to enter Follow the Coast. One day on the route. One shared stage.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-caption text-muted-foreground mb-4">Included</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">What's included</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            {inclusions.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="flex items-start gap-4 p-5 bg-background">
                <span className="text-accent shrink-0 mt-px">—</span>
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* After Registration */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-caption text-muted-foreground mb-4">Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-12">After registration</h2>
          </motion.div>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="flex items-start gap-6 py-5 border-b border-border last:border-b-0">
                <span className="font-display text-xl font-medium text-accent w-8 shrink-0">{item.step}</span>
                <span className="pt-0.5">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase mb-4">Run Venice with us.</h2>
            <p className="font-display text-2xl font-medium mt-6 mb-2">€199</p>
            <p className="text-muted-foreground mb-10 text-sm">Checkpoints, community, and your name in the book.</p>
            <Link to="/checkout?product=Home%20Run%20%E2%80%93%20Venice&variant=100km&price=%E2%82%AC199&return=/homerun">
              <MagneticButton
                className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-medium text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity"
                strength={0.2}
              >
                <EditorialArrow size={18} className="invert" />
                Register for the Home Run
              </MagneticButton>
            </Link>
            
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeRun;
