import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const JourneySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="journey" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 md:gap-24 items-start"
        >
          {/* Left: Cryptic manifesto style */}
          <div>
            <p className="text-sm text-muted-foreground tracking-wide mb-4">The Movement</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-foreground">
              This is not
              <br />
              <span className="text-muted-foreground">a race.</span>
            </h2>
          </div>

          {/* Right: The story */}
          <div className="md:pt-16">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Every 24 hours, one team conquers 100 kilometers of coastline. 
              At 7 a.m., they take over from the team before them. At sunset, 
              they pass the baton to the next.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Stage by stage, day by day, we're stitching together something 
              no one has ever done: running the entire European coastline.
            </p>
          </div>
        </motion.div>

        {/* Image grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 grid grid-cols-3 gap-2 md:gap-4"
        >
          <div className="col-span-2 aspect-[16/9] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80" 
              alt="Runners on coastal path"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="aspect-[9/16] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80" 
              alt="Ocean cliff"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80" 
              alt="Team stretching"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="col-span-2 aspect-[21/9] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80" 
              alt="Mediterranean coast"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};