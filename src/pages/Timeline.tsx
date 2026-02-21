import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { STAGES, ARCHIVE_YEARS } from '@/data/stages';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Timeline = () => {
  const yearData = useMemo(() => {
    return ARCHIVE_YEARS.map(year => {
      const yearStages = STAGES.filter(s => s.year === year);
      const completed = yearStages.filter(s => s.status === 'Completed');
      const countries = [...new Set(yearStages.map(s => s.country))];
      const stageRange = yearStages.length > 0
        ? `${yearStages[0].stageNumber}–${yearStages[yearStages.length - 1].stageNumber}`
        : '';

      const milestones: string[] = [];
      if (year === 2024) milestones.push('Project begins in Sagres, Portugal');
      if (year === 2025) milestones.push('Crossing into France');
      if (year === 2026) milestones.push('Target: reach Athens by end of year');
      if (year === 2027) milestones.push('Expansion into Eastern Mediterranean');

      return {
        year,
        totalStages: yearStages.length,
        completedStages: completed.length,
        countries,
        stageRange,
        milestones,
      };
    });
  }, []);

  return (
    <>
      <SEO
        title="Timeline | Follow the Coast"
        description="Follow the Coast advances slowly. Year by year, the coastline becomes continuous."
        path="/timeline"
      />
      <Navigation />
      <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-accent font-display text-sm uppercase tracking-wider mb-4">Archive</p>
            <h1 className="font-display text-3xl md:text-4xl mb-6">Timeline</h1>
            <p className="text-foreground/70 leading-relaxed max-w-xl mb-2">
              Follow the Coast advances slowly.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-xl mb-8">
              Year by year, the coastline becomes continuous.
            </p>
            <Link
              to="/archive"
              className="text-sm text-accent hover:text-accent/80 transition-colors font-display"
            >
              ← Back to Archive
            </Link>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[39px] md:left-[49px] top-0 bottom-0 w-px bg-border/40" />

            <div className="space-y-16">
              {yearData.map((entry, i) => (
                <motion.div
                  key={entry.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-20 md:pl-24"
                >
                  {/* Year marker */}
                  <div className="absolute left-0 top-0 flex items-center gap-3">
                    <span className="font-display text-2xl md:text-3xl text-foreground tabular-nums">
                      {entry.year}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>

                  {/* Content */}
                  <div className="pt-1 space-y-3">
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <span>
                        <span className="text-foreground font-display">{entry.completedStages}</span>
                        {' '}of {entry.totalStages} stages completed
                      </span>
                      <span>
                        Stages {entry.stageRange}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {entry.countries.map(c => (
                        <span
                          key={c}
                          className="text-xs font-display uppercase tracking-wider text-muted-foreground/60 px-2 py-1 border border-border/40 rounded-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    {entry.milestones.length > 0 && (
                      <div className="pt-2 space-y-1">
                        {entry.milestones.map((m, j) => (
                          <p key={j} className="text-sm text-foreground/60 italic">
                            {m}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Timeline;
