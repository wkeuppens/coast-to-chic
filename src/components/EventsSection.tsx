import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import coastalPath from '@/assets/coastal-path.jpg';
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
    image: coastalPath,
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
    <section id="events" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background text-foreground">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16"
        >
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              Side routes
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-medium">
              Other runs we organise.
            </h2>
          </div>
          {/* TODO: Replace href with actual info pack PDF when available */}
          <a
            href="mailto:hello@followthecoast.com?subject=Info%20pack%20request"
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-display"
          >
            <Download className="w-4 h-4" />
            Download info pack
          </a>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Link key={event.id} to={event.href}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group block"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-[16/10] bg-muted mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium mb-1 group-hover:text-accent transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body tracking-wide">
                    {event.location} — {event.date} — {event.distance}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
