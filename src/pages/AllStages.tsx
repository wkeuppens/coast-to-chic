import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useStages } from '@/hooks/useSanityData';

const STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  available: 'Open',
  booked: 'Booked',
  locked: 'Coming soon',
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'text-muted-foreground',
  available: 'text-accent',
  booked: 'text-muted-foreground',
  locked: 'text-muted-foreground/50',
}

const AllStages = () => {
  const { data: stages, loading } = useStages();
  const [filter, setFilter] = useState<string>('all');

  const filters = ['all', 'available', 'completed', 'booked'];

  const displayed = stages?.filter(s =>
    !s.isIceland && (filter === 'all' || s.status === filter)
  ) ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="All Stages" description="The full stage directory for Follow the Coast. 168 stages along the European coastline." path="/all-stages" />
      <Navigation />

      <main className="pt-32 pb-24 px-page max-w-content mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Archive</p>
          <h1 className="text-3xl md:text-4xl tracking-tight">All stages</h1>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-6 mb-8 border-b border-border pb-4">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-caption capitalize transition-colors ${filter === f ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {f === 'all' ? `All${stages ? ` (${stages.filter(s => !s.isIceland).length})` : ''}` : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground py-8">Loading stages…</div>
        ) : (
          <>
            <div className="grid grid-cols-[60px_1fr_1fr_80px_100px] gap-4 text-caption text-muted-foreground pb-3 border-b border-border">
              <span>#</span>
              <span>From</span>
              <span>To</span>
              <span>Country</span>
              <span className="text-right">Status</span>
            </div>

            {displayed.map((stage, i) => (
              <motion.div key={stage.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
              >
                <Link to={stage.status === 'available' ? `/register?stage=${stage.stageNumber}` : '#'}
                  className={`grid grid-cols-[60px_1fr_1fr_80px_100px] gap-4 py-4 border-b border-border/50 items-center group transition-colors ${stage.status === 'available' ? 'hover:bg-secondary/50 cursor-pointer' : 'cursor-default'}`}>
                  <span className="tabular-nums text-sm text-muted-foreground">#{stage.stageNumber}</span>
                  <span className={`text-sm ${stage.status === 'available' ? 'group-hover:text-accent transition-colors duration-300' : ''}`}>
                    {stage.startLocation}
                  </span>
                  <span className="text-sm">{stage.endLocation}</span>
                  <span className="text-caption text-muted-foreground">{stage.country}</span>
                  <span className={`text-caption text-right ${STATUS_COLORS[stage.status]}`}>
                    {STATUS_LABELS[stage.status]}
                  </span>
                </Link>
              </motion.div>
            ))}

            {!displayed.length && (
              <p className="text-sm text-muted-foreground py-8">No stages found.</p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllStages;
