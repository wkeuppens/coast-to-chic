import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import { MapPin, Calendar, Mountain, Clock } from 'lucide-react';
import { SideRouteLayout, QuickFacts, ContentSection, WideSection, fadeUp } from '@/components/layouts/SideRouteLayout';
import tmbHero from '@/assets/tmb-lake.jpg';

const sevenDayPerks = [
  'Like-minded group of runners',
  'Lodging carry-on along the route',
  'Luggage transport included',
  'Professional guide included',
  '8 overnights (6 included in price)',
  'Multiple payment options',
];

const fourDayPerks = [
  'Like-minded group of runners',
  'Lodging carry-on along the route',
  'Luggage transport included',
  'Professional guide included',
  '5 overnights (3 included in price)',
  'Multiple payment options',
];

const TourDuMontBlanc = () => (
  <SideRouteLayout
    title="Tour du Mont Blanc"
    description="Run the Tour du Mont Blanc with Follow the Coast. 4 or 7 days through France, Italy, and Switzerland. August 2026."
    path="/tour-du-mont-blanc"
    heroImage={tmbHero}
    heroAlt="Mont Blanc mountain trail"
    heroLabel="Expedition · France, Italy, Switzerland"
  >
    <QuickFacts
      facts={[
        { icon: Calendar, label: 'Dates', value: '1–9 Aug 2026' },
        { icon: MapPin, label: 'Start', value: 'Chamonix, France' },
        { icon: Mountain, label: 'Daily', value: '25km + 1500hm' },
        { icon: Clock, label: 'Duration', value: '4 or 7 days' },
      ]}
    />

    {/* The concept */}
    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">The concept</p>
        <h2 className="text-3xl md:text-4xl mb-block">Around the Mont Blanc massif.</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>Each summer, when we let the coastline rest, we spend a few days elsewhere. This year, that route leads to the mountains.</p>
          <p>Two ways to join:</p>
          <ul className="space-y-1 pl-1">
            <li>— 7-day full circuit — starting August 1</li>
            <li>— 4-day expert route — starting August 4</li>
          </ul>
          <p>Both routes arrive in Chamonix on August 9.</p>
          <p>Guides, luggage transfers, and overnight lodging are arranged for you. You carry what you need for the day. The rest follows.</p>
        </div>
      </motion.div>
    </ContentSection>

    {/* Pricing tiers */}
    <WideSection className="bg-secondary">
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">Pricing</p>
        <h2 className="text-3xl md:text-4xl mb-block">Pick your pace.</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 7 days */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-background p-8 md:p-10 flex flex-col border-2 border-accent">
          <h3 className="text-2xl mb-1">7 days</h3>
          <p className="text-caption text-muted-foreground mb-2">1 – 9 August 2026</p>
          <p className="text-xs text-muted-foreground mb-6">25km + 1500hm per day</p>
          <p className="text-4xl text-accent mb-block">€1,499</p>
          <ul className="space-y-3 mb-10 flex-1">
            {sevenDayPerks.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0 mt-px">—</span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/checkout?product=Tour%20du%20Mont%20Blanc&variant=7%20days&price=%E2%82%AC1%2C499&return=/tour-du-mont-blanc">
            <MagneticButton className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm" strength={0.2}>
              <EditorialArrow size={14} className="invert" />
              Register — €1,499
            </MagneticButton>
          </Link>
        </motion.div>

        {/* 4 days */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-background p-8 md:p-10 flex flex-col">
          <h3 className="text-2xl mb-1">4 days</h3>
          <p className="text-caption text-muted-foreground mb-2">4 – 9 August 2026</p>
          <p className="text-xs text-muted-foreground mb-6">25km + 2500hm per day</p>
          <p className="text-4xl text-accent mb-block">€999</p>
          <ul className="space-y-3 mb-10 flex-1">
            {fourDayPerks.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0 mt-px">—</span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/checkout?product=Tour%20du%20Mont%20Blanc&variant=4%20days&price=%E2%82%AC999&return=/tour-du-mont-blanc">
            <MagneticButton className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm" strength={0.2}>
              <EditorialArrow size={14} className="invert" />
              Register — €999
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </WideSection>

    {/* CTA */}
    <section className="py-section px-page">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl md:text-5xl uppercase mb-4">August 2026 · Chamonix</h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">Three countries. 4–7 days on the trail.</p>
          <Link to="/checkout?product=Tour%20du%20Mont%20Blanc&return=/tour-du-mont-blanc">
            <MagneticButton className="inline-flex items-center gap-3 bg-accent text-accent-foreground text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity" strength={0.2}>
              <EditorialArrow size={18} className="invert" />
              Run with us
            </MagneticButton>
          </Link>
          <p className="text-caption text-muted-foreground mt-6">Registrations close March 15, 2026.</p>
        </motion.div>
      </div>
    </section>
  </SideRouteLayout>
);

export default TourDuMontBlanc;
