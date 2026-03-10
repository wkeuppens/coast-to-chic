import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { SideRouteLayout, QuickFacts, ContentSection, WideSection, fadeUp } from '@/components/layouts/SideRouteLayout';
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

const HomeRun = () => (
  <SideRouteLayout
    title="Home Run"
    description="Shared 100km stage near Venice. €199 including checkpoints, community, and your name in the book. 20 April 2026."
    path="/homerun"
    heroImage={harborBoats}
    heroAlt="Venice waterfront"
    heroLabel="Side route · Venice"
    heroSubtitle="A shared 100km stage."
  >
    <QuickFacts
      facts={[
        { icon: Calendar, label: 'Date', value: '20 April 2026' },
        { icon: MapPin, label: 'Start', value: 'Venice Bridge' },
        { icon: Clock, label: 'Distance', value: '100 km' },
        { icon: Users, label: 'Price', value: '€199' },
      ]}
    />

    {/* The Concept */}
    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">The concept</p>
        <h2 className="text-3xl md:text-4xl mb-block">What is a Home Run?</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>A Home Run allows more runners to carry the coastline together for a single day.</p>
          <p>Start and finish are close to Venice. You run alongside others, each at their own rhythm. Checkpoints every 15 km provide food, drinks, and support.</p>
          <p>A lighter way to enter Follow the Coast. One day on the route. One shared stage.</p>
        </div>
      </motion.div>
    </ContentSection>

    {/* What's included */}
    <WideSection className="bg-secondary">
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">Included</p>
        <h2 className="text-3xl md:text-4xl mb-4">What's included</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-4 mt-12">
        {inclusions.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="flex items-start gap-4 p-5 bg-background">
            <span className="text-accent shrink-0 mt-px">—</span>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
    </WideSection>

    {/* After Registration */}
    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">Process</p>
        <h2 className="text-3xl md:text-4xl mb-block">After registration</h2>
      </motion.div>
      <div className="space-y-0">
        {timeline.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="flex items-start gap-6 py-5 border-b border-border last:border-b-0">
            <span className="text-xl text-accent w-8 shrink-0">{item.step}</span>
            <span className="pt-0.5">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </ContentSection>

    {/* CTA */}
    <section className="py-section px-page bg-secondary">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl md:text-5xl uppercase mb-4">Run Venice with us.</h2>
          <p className="text-2xl mt-6 mb-2">€199</p>
          <p className="text-muted-foreground mb-10 text-sm">Checkpoints, community, and your name in the book.</p>
          <Link to="/checkout?product=Home%20Run%20%E2%80%93%20Venice&variant=100km&price=%E2%82%AC199&return=/homerun">
            <MagneticButton className="inline-flex items-center gap-3 bg-accent text-accent-foreground text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity" strength={0.2}>
              <EditorialArrow size={18} className="invert" />
              Register for the Home Run
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  </SideRouteLayout>
);

export default HomeRun;
