import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import ftkHero from '@/assets/ftk-hero.jpg';
import tmbHero from '@/assets/tmb-lake.jpg';
import coastalPath from '@/assets/coastal-path.jpg';
import cliffBay from '@/assets/cliff-bay.jpg';

const CALENDAR = [
  {
    year: 2026,
    items: [
      { label: 'Stages (Italy, Slovenia, Croatia)', dates: '16 Apr → 20 May', type: 'stage', href: '/eu-stages' },
      { label: 'Book 3 Launch', dates: 'Sat 20 June · Antwerp', type: 'event', href: '/book-3' },
      { label: 'Tour du Mont Blanc', dates: '4–9 August', type: 'event', href: '/tour-du-mont-blanc' },
      { label: 'Stages (Montenegro, Albania, Greece)', dates: '8 Oct → 18 Nov', type: 'stage', href: '/eu-stages' },
    ],
  },
  {
    year: 2027,
    items: [
      { label: 'Follow The Kust', dates: 'Sat 6 February', type: 'event', href: '/follow-the-kust' },
      { label: 'Trail Retreat Girona', dates: '11–14 March', type: 'event', href: '/trail-retreat-girona' },
      { label: 'Crossing Madeira', dates: '5–9 May', type: 'event', href: '/crossing-madeira' },
      { label: 'Iceland 2027', dates: '12 Jun → 13 Jul', type: 'stage', href: '/iceland' },
      { label: 'Tour du Mont Blanc', dates: '1–9 August', type: 'event', href: '/tour-du-mont-blanc' },
      { label: 'Stages (coming soon)', dates: '1 Nov → 25 Nov', type: 'stage', href: '/eu-stages' },
      { label: 'Book 4 Event', dates: 'Sat 4 December', type: 'event', href: null },
    ],
  },
];

const EVENTS = [
  {
    id: 'book3',
    title: 'Book 3 Launch',
    meta: 'Antwerp — Sat 20 June 2026',
    description: 'Official publication of Follow The Coast Chapter Three (Gibraltar → Monaco). Pick up your book, drinks courtesy of Duvel, community run, presentation and Q&A.',
    image: coastalPath,
    href: '/book-3',
    tag: 'Event · Free & €45',
  },
  {
    id: 'ftk',
    title: 'Follow The Kust',
    meta: 'Belgium — Sat 6 Feb 2027',
    description: 'One day along the Belgian coast. 35 km or 75 km from De Panne to Knokke.',
    image: ftkHero,
    href: '/follow-the-kust',
    tag: 'Challenge · €39 / €59',
  },
  {
    id: 'girona',
    title: 'Trail Retreat Girona',
    meta: 'Girona, Spain — 11–14 Mar 2027',
    description: 'Four days of trail running under the Mediterranean sun. All logistics sorted. Shared or private room.',
    image: cliffBay,
    href: '/trail-retreat-girona',
    tag: 'Retreat · €899 / €1499',
  },
  {
    id: 'madeira',
    title: 'Crossing Madeira',
    meta: 'Madeira, Portugal — 5–9 May 2027',
    description: 'Three days across Madeira on the legendary MIUT track. 3 × 40 km through volcanic landscapes.',
    image: coastalPath,
    href: '/crossing-madeira',
    tag: 'Expedition · €799',
  },
  {
    id: 'tmb',
    title: 'Tour du Mont Blanc',
    meta: 'Chamonix — 4–9 Aug 2026 & 1–9 Aug 2027',
    description: 'Three countries. 25 km per day. One of the most iconic trails in the Alps.',
    image: tmbHero,
    href: '/tour-du-mont-blanc',
    tag: 'Expedition · €999 / €1499',
  },
];

const Events = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Events"
      description="All Follow the Coast events — stages, expeditions, retreats and community gatherings."
      path="/events"
    />
    <Navigation />

    <main className="pt-32 pb-24 px-page max-w-content mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
        <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Calendar</p>
        <h1 className="text-3xl md:text-4xl tracking-tight">Events</h1>
      </motion.div>

      {/* Calendar */}
      <section className="mb-20">
        {CALENDAR.map(({ year, items }) => (
          <div key={year} className="mb-10">
            <p className="text-caption text-accent mb-4 tabular-nums">{year}</p>
            {items.map(item => (
              <div key={item.label} className="grid grid-cols-[1fr_auto] gap-4 py-4 border-b border-border/50 items-baseline">
                <div className="flex items-baseline gap-4">
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 shrink-0 ${item.type === 'stage' ? 'bg-foreground/10 text-foreground' : 'bg-accent/10 text-accent'}`}>
                    {item.type === 'stage' ? 'Stage' : 'Event'}
                  </span>
                  {item.href ? (
                    <Link to={item.href} className="text-sm hover:text-accent transition-colors duration-300">{item.label}</Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  )}
                </div>
                <span className="text-caption text-muted-foreground text-right shrink-0">{item.dates}</span>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Event cards */}
      <section>
        <hr className="rule mb-12" />
        <p className="text-label mb-10"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Upcoming events</p>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {EVENTS.map((event, i) => (
            <motion.article key={event.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.07 }}>
              <Link to={event.href} className="group block">
                <div className="overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                  <img src={event.image} alt={event.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.015]" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base mb-1 group-hover:text-accent transition-colors duration-300">{event.title}</h2>
                    <p className="text-caption text-muted-foreground mb-3">{event.meta}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-accent mt-4">{event.tag}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Events;
