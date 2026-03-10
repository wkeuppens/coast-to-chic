import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ftkHero from '@/assets/ftk-hero.jpg';
import tmbLakePanorama from '@/assets/tmb-lake-panorama.jpg';
import harborBoats from '@/assets/harbor-boats.jpg';

const events = [
  {
    id: 'homerun',
    title: 'Home Run Venice',
    meta: 'Venice — 20 Apr 2026 — 100 km',
    image: harborBoats,
    href: '/homerun',
  },
  {
    id: 'ftk',
    title: 'Follow The Kust',
    meta: 'Belgium — 6 Feb 2027 — 35 or 75 km',
    image: ftkHero,
    href: '/follow-the-kust',
  },
  {
    id: 'tmb',
    title: 'Tour du Mont Blanc',
    meta: 'France, Italy, Switzerland — Summer 2026 — 170 km',
    image: tmbLakePanorama,
    href: '/tour-du-mont-blanc',
  },
];

/**
 * Side routes — editorial cards with large images, minimal metadata.
 */
export const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="events" className="py-section px-page">
      <div ref={ref} className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-block"
        >
          <p className="text-label mb-element">Side routes</p>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight">
            Other runs we organise
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, i) => (
            <Link key={event.id} to={event.href}>
              <motion.article
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group"
              >
                <div className="overflow-hidden mb-4" style={{ aspectRatio: '4 / 3' }}>
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
                  />
                </div>
                <h3 className="font-display text-base md:text-lg mb-1 group-hover:opacity-50 transition-opacity duration-500">
                  {event.title}
                </h3>
                <p className="text-caption text-muted-foreground">{event.meta}</p>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
