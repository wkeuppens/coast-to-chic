import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { EditorialArrow } from './EditorialArrow';
import ftkHero from '@/assets/ftk-hero.jpg';
import tmbLakePanorama from '@/assets/tmb-lake-panorama.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';

const events = [
  {
    id: 'homerun',
    title: 'Home Run Venice',
    location: 'Venice, Italy',
    date: '20 Apr 2026',
    distance: '100km',
    image: harborBoats,
    href: '/homerun',
  },
  {
    id: 'ftk',
    title: 'Follow The Kust',
    location: 'Belgium',
    date: '6 Feb 2027',
    distance: '35 or 75km',
    image: ftkHero,
    href: '/follow-the-kust',
  },
  {
    id: 'tmb',
    title: 'Tour du Mont Blanc',
    location: 'France, Italy, Switzerland',
    date: 'Summer 2026',
    distance: '170km',
    image: tmbLakePanorama,
    href: '/tour-du-mont-blanc',
  },
];

export const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-caption text-muted-foreground mb-4">
            <EditorialArrow size={12} className="mr-2 opacity-40" />
            Side routes
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Other runs we organise.
          </h2>
        </motion.div>

        {/* Event cards — editorial grid, no hover lift, book-style */}
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Link key={event.id} to={event.href}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/3] overflow-hidden mb-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="font-display text-lg font-medium mb-1 group-hover:opacity-60 transition-opacity">
                  {event.title}
                </h3>
                <p className="text-caption text-muted-foreground">
                  {event.location} — {event.date} — {event.distance}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
