import { motion } from 'framer-motion';
import { MapPin, Calendar, Mountain, Clock } from 'lucide-react';
import { SideRouteLayout, QuickFacts, ContentSection, WideSection, fadeUp } from '@/components/layouts/SideRouteLayout';
import { EventCheckoutButton } from '@/components/EventCheckoutButton';
import tmbHero from '@/assets/tmb-lake.jpg';

const perks = [
  'Like-minded group of runners',
  'Luggage transport included',
  'Professional guide included',
  'Lodging along the route',
  '5 overnights (3 included in price)',
  'Multiple payment options',
];

const TourDuMontBlanc = () => (
  <SideRouteLayout
    title="Tour du Mont Blanc"
    description="Run the Tour du Mont Blanc with Follow the Coast. 4–9 August 2026. France, Italy, Switzerland."
    path="/tour-du-mont-blanc"
    heroImage={tmbHero}
    heroAlt="Mont Blanc mountain trail"
    heroLabel="Expedition · France, Italy, Switzerland"
  >
    <QuickFacts
      facts={[
        { icon: Calendar, label: 'Dates', value: '4–9 August 2026' },
        { icon: MapPin, label: 'Start', value: 'Chamonix, France' },
        { icon: Mountain, label: 'Daily', value: '~25km + 1500hm' },
        { icon: Clock, label: 'Duration', value: '5 days' },
      ]}
    />

    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">The route</p>
        <h2 className="text-3xl md:text-4xl mb-block">Three countries. One trail.</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            The Tour du Mont Blanc is one of the most iconic long-distance routes in the Alps —
            circumnavigating Mont Blanc through France, Italy, and Switzerland.
          </p>
          <p>
            Follow the Coast runs it as a 5-day expedition in August 2026. Small group, shared experience.
            A guide throughout. Luggage handled. You just run.
          </p>
        </div>
      </motion.div>
    </ContentSection>

    <WideSection className="bg-secondary">
      <motion.div {...fadeUp} className="mb-12">
        <h2 className="text-3xl md:text-4xl mb-block">What's included</h2>
      </motion.div>
      <div className="max-w-lg">
        <div className="bg-background p-8 md:p-10 flex flex-col border border-border">
          <p className="text-caption text-muted-foreground mb-2">4–9 August 2026</p>
          <p className="text-4xl text-accent mb-6">€999</p>
          <ul className="space-y-3 mb-10">
            {perks.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground shrink-0 mt-px">—</span>
                {item}
              </li>
            ))}
          </ul>
          <EventCheckoutButton
            eventId="tmb_2027_4day"
            price={999}
            label="Register — €999"
          />
        </div>
      </div>
    </WideSection>

    <ContentSection>
      <motion.div {...fadeUp}>
        <p className="text-caption text-muted-foreground mb-4">Practical</p>
        <h2 className="text-3xl md:text-4xl mb-block">Getting there</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Start and finish in Chamonix. Closest airports are Geneva (1h) and Lyon (2h).
            Full logistics details shared after registration.
          </p>
        </div>
      </motion.div>
    </ContentSection>
  </SideRouteLayout>
);

export default TourDuMontBlanc;
