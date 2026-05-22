import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import { SideRouteLayout, QuickFacts, ContentSection, WideSection, fadeUp } from '@/components/layouts/SideRouteLayout';
import { EventCheckoutButton } from '@/components/EventCheckoutButton';
import ftkHero from '@/assets/ftk-hero.jpg';

const perks = [
  'GPX route prepared for your device',
  'Food & drink checkpoints along the route',
  'Bag transport to the finish',
  'Finish gathering in Knokke',
];

const FollowTheKust = () => (
  <SideRouteLayout
    title="Follow The Kust"
    description="One-day run along the Belgian coast. 35km or 75km. De Panne to Knokke. 6 February 2027."
    path="/follow-the-kust"
    heroImage={ftkHero}
    heroAlt="Runner on the Belgian coast at sunset"
    heroLabel="Side route · Belgium"
  >
    <QuickFacts
      facts={[
        { icon: Calendar, label: 'Date', value: 'Saturday 6 February 2027' },
        { icon: MapPin, label: 'Route', value: 'De Panne → Knokke' },
        { icon: Clock, label: 'Distances', value: '35 km or 75 km' },
        { icon: Users, label: 'Levels', value: 'Open to all' },
      ]}
    />

    {/* The concept */}
    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">The concept</p>
        <h2 className="text-3xl md:text-4xl mb-block">The Belgian coastline, shared.</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>Follow The Kust is a one-day run along the Belgian shoreline.</p>
          <p>Two distances toward Knokke:</p>
          <ul className="space-y-1 pl-1">
            <li>— 35 km — Ostend to Knokke</li>
            <li>— 75 km — De Panne to Knokke</li>
          </ul>
          <p>We prepare the route, organise checkpoints, transport bags, and welcome everyone at the finish. No timing. No rankings. Just a day following the coast.</p>
        </div>
      </motion.div>
    </ContentSection>

    {/* Pricing tiers */}
    <WideSection className="bg-secondary">
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">Pricing</p>
        <h2 className="text-3xl md:text-4xl mb-block">Choose your distance.</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8">

        {/* 35 km */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-background p-8 md:p-10 flex flex-col">
          <h3 className="text-2xl mb-1">35 km</h3>
          <p className="text-caption text-muted-foreground mb-6">Ostend → Knokke</p>
          <p className="text-4xl text-accent mb-block">€39</p>
          <ul className="space-y-3 mb-10 flex-1">
            {perks.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0 mt-px">—</span>
                {item}
              </li>
            ))}
          </ul>
          <EventCheckoutButton
            eventId="ftk_35km"
            price={39}
            label="Register — €39"
            addDinner
          />
        </motion.div>

        {/* 75 km */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-background p-8 md:p-10 flex flex-col border-2 border-accent">
          <h3 className="text-2xl mb-1">75 km</h3>
          <p className="text-caption text-muted-foreground mb-6">De Panne → Knokke</p>
          <p className="text-4xl text-accent mb-block">€59</p>
          <ul className="space-y-3 mb-10 flex-1">
            {perks.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0 mt-px">—</span>
                {item}
              </li>
            ))}
          </ul>
          <EventCheckoutButton
            eventId="ftk_75km"
            price={59}
            label="Register — €59"
            addDinner
          />
        </motion.div>
      </div>
      <motion.p {...fadeUp} className="text-caption text-muted-foreground mt-8 text-center">
        Optional: community dinner after the run — €55. Add it during registration.
      </motion.p>
    </WideSection>

    {/* CTA */}
    <section className="py-section px-page">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl md:text-5xl uppercase mb-6">Run the kust with us.</h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">6 February 2027. The Belgian coast awaits.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EventCheckoutButton eventId="ftk_35km" price={39} label="35km — €39" addDinner />
            <EventCheckoutButton eventId="ftk_75km" price={59} label="75km — €59" addDinner />
          </div>
        </motion.div>
      </div>
    </section>
  </SideRouteLayout>
);

export default FollowTheKust;
