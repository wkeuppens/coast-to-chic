import { motion } from 'framer-motion';
import { MapPin, Calendar, Mountain, Users } from 'lucide-react';
import { SideRouteLayout, QuickFacts, ContentSection, WideSection, fadeUp } from '@/components/layouts/SideRouteLayout';
import { EventCheckoutButton } from '@/components/EventCheckoutButton';
import cliffBay from '@/assets/cliff-bay.jpg';

const perks = [
  'Like-minded group of runners',
  'All logistics sorted and booked',
  'Luggage transport included',
  'Professional guide throughout',
  '4 overnights included',
  'Multiple payment options',
];

const TrailRetreatGirona = () => (
  <SideRouteLayout
    title="Trail Retreat Girona"
    description="Four days of trail running under the Mediterranean sun. Girona, Spain. March 11–14 2027."
    path="/trail-retreat-girona"
    heroImage={cliffBay}
    heroAlt="Trail running in Catalonia"
    heroLabel="Retreat · Girona, Spain"
  >
    <QuickFacts facts={[
      { icon: Calendar, label: 'Dates', value: '11–14 March 2027' },
      { icon: MapPin, label: 'Location', value: 'Girona, Spain' },
      { icon: Mountain, label: 'Daily', value: '20–30 km trail' },
      { icon: Users, label: 'Levels', value: 'All levels' },
    ]} />

    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">The concept</p>
        <h2 className="text-3xl md:text-4xl mb-block">Start your year right.</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Girona is one of Europe's great running cities — a compact medieval town surrounded by
            trails that wind through cork forests, vineyards, and up into the Pyrenean foothills.
          </p>
          <p>
            Four days with a group of like-minded runners. Central comfortable base camp.
            Everything sorted. You just show up and run.
          </p>
        </div>
      </motion.div>
    </ContentSection>

    <WideSection className="bg-secondary">
      <motion.div {...fadeUp} className="mb-12">
        <h2 className="text-3xl md:text-4xl mb-2">Two options</h2>
        <p className="text-muted-foreground">Same dates, same trails, same group. Choose your room type.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
        {/* Shared */}
        <div className="bg-background p-8 flex flex-col border border-border">
          <h3 className="text-xl mb-1">Shared room</h3>
          <p className="text-caption text-muted-foreground mb-6">4 days · 4 nights</p>
          <p className="text-4xl text-accent mb-6">€899</p>
          <ul className="space-y-3 mb-10 flex-1">
            {perks.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0">—</span>{p}
              </li>
            ))}
          </ul>
          <EventCheckoutButton eventId="trg_shared" price={899} label="Register — €899" />
        </div>
        {/* Own room */}
        <div className="bg-background p-8 flex flex-col border-2 border-accent">
          <h3 className="text-xl mb-1">Private room</h3>
          <p className="text-caption text-muted-foreground mb-6">4 days · 4 nights</p>
          <p className="text-4xl text-accent mb-6">€1,499</p>
          <ul className="space-y-3 mb-10 flex-1">
            {perks.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0">—</span>{p}
              </li>
            ))}
            <li className="flex items-start gap-3 text-sm">
              <span className="text-muted-foreground shrink-0">—</span>Private en-suite room
            </li>
          </ul>
          <EventCheckoutButton eventId="trg_own" price={1499} label="Register — €1,499" />
        </div>
      </div>
    </WideSection>
  </SideRouteLayout>
);

export default TrailRetreatGirona;
