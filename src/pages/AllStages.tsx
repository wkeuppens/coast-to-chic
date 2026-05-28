import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { TideLine } from '@/components/system';
import { useStages } from '@/hooks/useSanityData';

const STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  available: 'Open',
  booked: 'Booked',
  locked: 'Soon',
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'text-muted-foreground',
  available: 'text-accent',
  booked: 'text-muted-foreground',
  locked: 'text-muted-foreground/50',
};

/**
 * Coastal Archive — a designed contents page.
 * Tabular mono rows. Row hover reveals a thumbnail pinned to the side margin.
 * Filter / sort pinned to a corner, also in mono. No card grid.
 */
const AllStages = () => {
  const { data: stages, loading } = useStages();
  const [filter, setFilter] = useState<string>('all');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const filters = ['all', 'available', 'completed', 'booked'];

  const displayed = (stages ?? [])
    .filter((s) => !s.isIceland && (filter === 'all' || s.status === filter))
    .sort((a, b) => a.stageNumber - b.stageNumber);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Coastal Archive"
        description="The full stage directory for Follow the Coast. 168 catalogued stages along the European coastline."
        path="/all-stages"
      />
      <Navigation />

      <main className="pt-32 pb-24">
        {/* Header — wordmark line, system reference */}
        <div className="px-page mb-10 flex items-baseline gap-6">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em]">
            Coastal Archive
          </span>
          <span className="flex-1 border-t border-foreground/30" />
          <span className="text-index-sm text-muted-foreground">
            168 stages · index 001 — 168
          </span>
        </div>

        <div className="px-page">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10 max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl tracking-tight mb-4 font-light">
              Index of stages, west to east, along the coast of Europe.
            </h1>
            <p className="text-sm text-muted-foreground">
              Catalogue raisonné of the 168 stretches that make up the route. Each row carries its reference number, region, distance, and coordinates. Open rows lead to the registration sheet.
            </p>
          </motion.div>

          {/* Filter — pinned to corner, mono */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors ${
                    filter === f
                      ? 'text-foreground border-b border-foreground pb-0.5'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'all'
                    ? `All · ${stages ? stages.filter((s) => !s.isIceland).length : 0}`
                    : `${STATUS_LABELS[f]} · ${stages ? stages.filter((s) => !s.isIceland && s.status === f).length : 0}`}
                </button>
              ))}
            </div>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
              Sorted · north → south → east
            </span>
          </div>
        </div>

        <TideLine />

        <div className="relative">
          {/* Side-margin thumbnail (hover reveal) */}
          {hoverIdx !== null && displayed[hoverIdx]?.image && (
            <div
              className="hidden lg:block fixed top-1/2 right-8 -translate-y-1/2 z-10 pointer-events-none"
              style={{ width: '18rem' }}
            >
              <img
                src={displayed[hoverIdx].image}
                alt=""
                className="w-full aspect-[3/2] object-cover border border-foreground/20"
              />
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                № {String(displayed[hoverIdx].stageNumber).padStart(3, '0')} ·{' '}
                {displayed[hoverIdx].region ?? displayed[hoverIdx].country}
              </p>
            </div>
          )}

          <div className="px-page mt-6">
            {/* Header row — mono */}
            <div className="grid grid-cols-[3.5rem_1fr_1fr_6rem_8rem_5rem] gap-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground py-3 border-b border-foreground/30">
              <span>№</span>
              <span>From</span>
              <span>To</span>
              <span>Distance</span>
              <span>Coordinates</span>
              <span className="text-right">Status</span>
            </div>

            {loading ? (
              <div className="font-mono text-xs text-muted-foreground py-8">
                Loading index…
              </div>
            ) : (
              <>
                {displayed.map((stage, i) => {
                  const dist = stage.distanceKm ? `${stage.distanceKm} km` : '—';
                  const coord = stage.startCoord
                    ? `${stage.startCoord.lat.toFixed(2)}°N · ${stage.startCoord.lng.toFixed(2)}°E`
                    : '—';
                  return (
                    <Link
                      key={stage.id}
                      to={stage.status === 'available' ? `/register?stage=${stage.stageNumber}` : '#'}
                      onMouseEnter={() => setHoverIdx(i)}
                      onMouseLeave={() => setHoverIdx(null)}
                      className={`grid grid-cols-[3.5rem_1fr_1fr_6rem_8rem_5rem] gap-4 py-3 border-b border-foreground/10 items-center group transition-colors ${
                        stage.status === 'available'
                          ? 'hover:bg-foreground/[0.03] cursor-pointer'
                          : 'cursor-default'
                      }`}
                    >
                      <span className="font-mono text-[0.75rem] tabular-nums text-muted-foreground">
                        {String(stage.stageNumber).padStart(3, '0')}
                      </span>
                      <span
                        className={`text-sm ${
                          stage.status === 'available'
                            ? 'group-hover:text-accent transition-colors duration-200'
                            : ''
                        }`}
                      >
                        {stage.startLocation}
                      </span>
                      <span className="text-sm">{stage.endLocation}</span>
                      <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                        {dist}
                      </span>
                      <span className="font-mono text-[0.65rem] tabular-nums text-muted-foreground truncate">
                        {coord}
                      </span>
                      <span
                        className={`font-mono text-[0.625rem] uppercase tracking-[0.12em] text-right ${STATUS_COLORS[stage.status]}`}
                      >
                        {STATUS_LABELS[stage.status]}
                      </span>
                    </Link>
                  );
                })}

                {!displayed.length && (
                  <p className="font-mono text-xs text-muted-foreground py-8">
                    No stages in this filter.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllStages;
