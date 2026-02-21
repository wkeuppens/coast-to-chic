import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { STAGES } from '@/data/stages';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const completedStages = STAGES
  .filter(s => s.status === 'Completed' && s.shoreholder)
  .sort((a, b) => a.stageNumber - b.stageNumber);

const Shoreholders = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <>
      <SEO
        title="Shoreholders | Follow the Coast"
        description="Every stage is carried by someone. Meet the runners forming the human line around Europe's coastline."
        path="/shoreholders"
      />
      <Navigation />
      <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-accent font-display text-sm uppercase tracking-wider mb-4">Archive</p>
            <h1 className="font-display text-3xl md:text-4xl mb-6">Shoreholders</h1>
            <p className="text-foreground/70 leading-relaxed max-w-xl mb-2">
              Every stage is carried by someone.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-xl mb-8">
              Together, these runners form the human line around Europe's coastline.
            </p>
            <Link
              to="/archive"
              className="text-sm text-accent hover:text-accent/80 transition-colors font-display"
            >
              ← Back to Archive
            </Link>
          </motion.div>

          {/* List */}
          <div ref={ref} className="space-y-0">
            {completedStages.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: Math.min(i * 0.02, 1) }}
                className="grid grid-cols-[60px_1fr_1fr_80px] md:grid-cols-[80px_1fr_1fr_100px] items-baseline py-3 border-b border-border/40"
              >
                <span className="text-xs text-muted-foreground font-display tabular-nums">
                  {String(stage.stageNumber).padStart(3, '0')}
                </span>
                <span className="text-sm text-foreground font-display">
                  {stage.shoreholder}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stage.location}, {stage.country}
                </span>
                <span className="text-xs text-muted-foreground/60 text-right tabular-nums">
                  {stage.year}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Shoreholders;
