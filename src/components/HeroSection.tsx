import { motion } from 'framer-motion';
import { useStages } from '@/hooks/useSanityData';
import { CoastLine, type CoastNode } from '@/components/system';
import heroRunnerCoast from '@/assets/hero-runner-coast.jpg';
import { useSiteSettings } from '@/hooks/useSanityData';

/**
 * Hero — Line / Edge / Index.
 * Full-bleed documentary photograph in the upper viewport. Wordmark pinned
 * to the top-left, hard against the edge, with a rule extending to the right.
 * Beneath the image: the CoastLine, the persistent hairline of the system.
 */
export const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: stages } = useStages();

  const heroImage = settings?.heroImageUrl ?? heroRunnerCoast;

  // Build coastline nodes from real stage data; first 'available' becomes active.
  const nodes: CoastNode[] = (stages ?? [])
    .filter((s) => !s.isIceland)
    .sort((a, b) => a.stageNumber - b.stageNumber)
    .map((s, _i, all) => {
      const firstActive = all.find((x) => x.status === 'available');
      return {
        stageNumber: s.stageNumber,
        region: s.region ?? s.country,
        distance: s.distanceKm ? `${s.distanceKm} km` : '—',
        coordinates: s.startCoord
          ? `${s.startCoord.lat.toFixed(2)}°N · ${s.startCoord.lng.toFixed(2)}°E`
          : undefined,
        href: s.status === 'available' ? `/register?stage=${s.stageNumber}` : `/archive`,
        active: firstActive?.id === s.id,
      };
    });

  return (
    <section className="relative w-full">
      {/* Full-bleed documentary plate */}
      <div className="relative h-[78vh] md:h-[88vh] w-full overflow-hidden">
        <motion.img
          src={heroImage}
          alt="A runner moves along the European coastline at first light"
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] lg:object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />

        {/* Tide-line caption pinned bottom-left */}
        <div className="absolute bottom-6 left-0 right-0 px-page text-primary-foreground">
          <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-end gap-6">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] opacity-80">
              Plate 001 · Northern coast · 05:42
            </p>
            <span className="hidden md:block w-px h-3 bg-current opacity-50" />
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] opacity-80 md:text-right">
              168 stages · counter-clockwise · 100 km
            </p>
          </div>
        </div>
      </div>

      {/* The Line — bleeds off both edges, marks every stage in the archive */}
      <div className="py-8 md:py-10 border-t border-foreground/15">
        <CoastLine nodes={nodes} wordmark={false} />
        <div className="px-page mt-3 flex justify-between text-index-sm text-muted-foreground">
          <span>Stage 001 · Sagres, PT</span>
          <span>168 nodes · scrub or scroll to move along the coast</span>
          <span>Stage 168 · Piran, SI</span>
        </div>
      </div>
    </section>
  );
};
