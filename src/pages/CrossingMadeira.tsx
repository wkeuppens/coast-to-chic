import { motion } from 'framer-motion';
import { MapPin, Calendar, Mountain, Clock } from 'lucide-react';
import { SideRouteLayout, QuickFacts, ContentSection, WideSection, fadeUp } from '@/components/layouts/SideRouteLayout';
import { EventCheckoutButton } from '@/components/EventCheckoutButton';
import harborBoats from '@/assets/harbor-boats.jpg';

const perks = [
  'Like-minded group of runners',
  'All logistics sorted and booked',
  'Luggage transport included',
  'Professional guide throughout',
  '4 overnights (3 included in price)',
  'Multiple payment options',
];

const CrossingMadeira = () => (
  <SideRouteLayout
    title="Crossing Madeira"
    description="Trail running across Madeira on the legendary MIUT track. 3 × 40 km. May 5–9 2027."
    path="/crossing-madeira"
    heroImage={harborBoats}
    heroAlt="Madeira coastal trail"
    heroLabel="Expedition · Madeira, Portugal"
  >
    <QuickFacts facts={[
      { icon: Calendar, label: 'Dates', value: '5–9 May 2027' },
      { icon: MapPin, label: 'Location', value: 'Madeira, Portugal' },
      { icon: Mountain, label: 'Daily', value: '3 days × 40 km' },
      { icon: Clock, label: 'Duration', value: '4 nights' },
    ]} />

    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">The route</p>
        <h2 className="text-3xl md:text-4xl mb-block">Volcanic. Vertical. Unforgettable.</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Madeira's landscape is unlike anywhere else in Europe — steep levada paths carved into
            cliffsides, laurisilva forests, and ocean views that stretch to the horizon.
          </p>
          <p>
            We cross the island over three days on the MIUT track, one of the most technically
            demanding trail routes in the Atlantic. Small group. All logistics sorted.
          </p>
        </div>
      </motion.div>
    </ContentSection>

    <WideSection className="bg-secondary">
      <motion.div {...fadeUp} className="mb-10">
        <h2 className="text-3xl md:text-4xl mb-2">Madeira International Ultra Trail</h2>
        <p className="text-caption text-muted-foreground">5–9 May 2027 · Routinier & expert level</p>
      </motion.div>
      <div className="max-w-md">
        <div className="bg-background p-8 flex flex-col border border-border">
          <p className="text-4xl text-accent mb-6">€799</p>
          <ul className="space-y-3 mb-10">
            {perks.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0">—</span>{p}
              </li>
            ))}
          </ul>
          <EventCheckoutButton eventId="madeira" price={799} label="Register — €799" />
        </div>
      </div>
    </WideSection>
  </SideRouteLayout>
);

export default CrossingMadeira;
