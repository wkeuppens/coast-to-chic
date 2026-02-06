import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import coastalPath from '@/assets/coastal-path.jpg';
import utmbTrail from '@/assets/utmb-trail.png';

const events = [
  {
    id: 'ftk',
    title: 'Follow The Kust',
    location: 'Belgium',
    date: '7 Feb 2026',
    distance: '35 or 75km',
    duration: '1 day',
    image: coastalPath,
  },
  {
    id: 'tmb',
    title: 'Tour du Mont Blanc',
    location: 'France, Italy, Switzerland',
    date: 'Summer 2026',
    distance: '170km',
    duration: 'Multi-day',
    image: utmbTrail,
  },
];

export const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-secondary">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-sm text-muted-foreground tracking-wide mb-4">
            Side routes
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground">
            Other runs we organise.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.a
              key={event.id}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group block"
            >
              <div className="aspect-[16/10] bg-muted mb-6 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-2 group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{event.date}</p>
                  <p>{event.distance}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
