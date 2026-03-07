import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { EditorialArrow } from './EditorialArrow';
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
    <section id="events" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-background text-foreground">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16"
        >
          <div>
            <p className="text-caption text-muted-foreground mb-4">
              Side routes
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Other runs we organise.
            </h2>
          </div>
          <a
            href="mailto:hello@followthecoast.com?subject=Info%20pack%20request"
            className="inline-flex items-center gap-2 text-caption text-accent hover:text-accent/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download info pack
          </a>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <Link key={event.id} to={event.href}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group block"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-[16/10] bg-muted mb-5 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex-shrink-0">
                      <EditorialArrow size={16} />
                    </div>
                    <h3 className="font-display text-lg font-medium group-hover:text-accent transition-colors duration-300">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-caption text-muted-foreground">
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
