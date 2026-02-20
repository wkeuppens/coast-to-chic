import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import coastalPath from '@/assets/coastal-path.jpg';
import utmbTrail from '@/assets/utmb-trail.png';
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
    date: '7 Feb 2026',
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
    image: utmbTrail,
    href: '/tour-du-mont-blanc',
  },
];

export const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background text-foreground">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-sm text-foreground/50 tracking-wide mb-4">
            Side routes
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium">
            Other runs we organise.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Link key={event.id} to={event.href}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group block"
              >
                <div className="aspect-[16/10] bg-muted mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl font-medium mb-2 group-hover:text-accent transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{event.date}</p>
                    <p>{event.distance}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
