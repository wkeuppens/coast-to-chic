import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { STAGES } from '@/data/stages';

/** Pick n unique random items from an array */
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export const PhotoGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  // Pick 3 random stages on mount
  const randomStages = useMemo(() => pickRandom(STAGES, 3), []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 overflow-hidden bg-background">
      <div className="px-6 md:px-12 lg:px-24 mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground tracking-wide mb-4">Gallery</p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground">
            Along the way.
          </h2>
        </div>
        <Link
          to="/gallery"
          className="hidden md:flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-display group"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <motion.div
        style={{ x }}
        className="flex gap-6 pl-6 md:pl-12 lg:pl-24"
      >
        {randomStages.map((stage) => (
          <Link
            key={stage.id}
            to={stage.link}
            className="relative flex-shrink-0 w-[300px] md:w-[400px] lg:w-[500px] aspect-[3/2] overflow-hidden group block"
          >
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Deterministic placeholder colour per stage */}
              <div
                className="w-full h-full flex items-end p-4"
                style={{
                  backgroundColor: `hsl(${(parseInt(stage.id.replace('stage-', ''), 10) * 37) % 360}, 35%, 55%)`,
                }}
              >
                <span className="font-display text-sm text-white/90 tracking-wide">
                  {stage.title} — {stage.location}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Mobile link */}
      <div className="md:hidden px-6 mt-8">
        <Link
          to="/gallery"
          className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-display"
        >
          View all photos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
