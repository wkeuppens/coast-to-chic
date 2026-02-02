import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TextReveal } from './TextReveal';

export const JourneySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="journey" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Left: Cryptic manifesto style */}
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm text-muted-foreground tracking-wide mb-4"
            >
              <span className="inline-block animate-pulse mr-2">●</span>
              The Movement
            </motion.p>
            
            {isInView && (
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-foreground">
                <TextReveal delay={0.2}>This is not</TextReveal>
                <br />
                <span className="text-muted-foreground">
                  <TextReveal delay={0.5}>a race.</TextReveal>
                </span>
              </h2>
            )}
          </div>

          {/* Right: The story with staggered paragraphs */}
          <div className="md:pt-16">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6"
            >
              Every 24 hours, one team conquers 100 kilometers of coastline. 
              At 7 a.m., they take over from the team before them. At sunset, 
              they pass the baton to the next.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Stage by stage, day by day, we're stitching together something 
              no one has ever done: <span className="text-foreground font-medium">running the entire European coastline.</span>
            </motion.p>
          </div>
        </div>

        {/* Image grid with hover effects */}
        <div className="mt-24 grid grid-cols-3 gap-2 md:gap-4">
          <ImageCard 
            src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80"
            alt="Runners on coastal path"
            className="col-span-2 aspect-[16/9]"
            delay={0.5}
            isInView={isInView}
          />
          <ImageCard 
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80"
            alt="Ocean cliff"
            className="aspect-[9/16]"
            delay={0.6}
            isInView={isInView}
          />
          <ImageCard 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
            alt="Team stretching"
            className="aspect-square"
            delay={0.7}
            isInView={isInView}
          />
          <ImageCard 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
            alt="Mediterranean coast"
            className="col-span-2 aspect-[21/9]"
            delay={0.8}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
};

const ImageCard = ({ 
  src, 
  alt, 
  className, 
  delay,
  isInView 
}: { 
  src: string; 
  alt: string; 
  className: string;
  delay: number;
  isInView: boolean;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
    transition={{ duration: 0.8, delay }}
    className={`${className} overflow-hidden group cursor-pointer relative`}
  >
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    {/* Reveal overlay on hover */}
    <motion.div 
      className="absolute inset-0 bg-accent/0 flex items-center justify-center"
      whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
      transition={{ duration: 0.3 }}
    />
  </motion.div>
);
