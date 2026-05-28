import { motion } from 'framer-motion';
import { useStages, useSiteSettings } from '@/hooks/useSanityData';
import { CoastLine, type CoastNode } from '@/components/system';
import { MagneticButton } from './MagneticButton';
import heroRunnerCoast from '@/assets/hero-runner-coast.jpg';

/**
 * Hero — Line / Edge / Index.
 * Full-bleed documentary photograph with right-aligned headline, subline
 * and the two pill CTAs. Beneath the image: the CoastLine, the persistent
 * hairline of the system.
 */
export const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: stages } = useStages();

  const headline = settings?.heroHeadline ?? 'Follow The Coast';
  const subline =
    settings?.heroSubline ?? "All of Europe's coastline. Counter-clockwise. 100 km at a time.";
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
          alt="Runner on a coastal trail along the European shoreline"
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] lg:object-center"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Headline + CTAs, pinned bottom-right */}
        <div className="absolute inset-0 flex flex-col justify-end items-end p-8 md:p-12 lg:p-16 text-right">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-end"
          >
            <h1 className="font-display text-primary-foreground text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.9] mb-4">
              {headline.split(' ')[0]}
              <br />
              {headline.split(' ').slice(1).join(' ')}
            </h1>
            <p className="text-caption text-primary-foreground/60 max-w-md mb-8">
              {subline}
              <span className="inline-block w-3 h-px bg-accent ml-2 align-middle" />
            </p>
            <div className="flex items-center gap-4">
              <MagneticButton
                href="/register"
                className="inline-flex items-center justify-center bg-accent text-accent-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                Register
              </MagneticButton>
              <MagneticButton
                href="#newsletter"
                className="inline-flex items-center justify-center border border-primary-foreground/40 text-primary-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:border-primary-foreground/70 transition-colors"
              >
                Newsletter
              </MagneticButton>
            </div>
          </motion.div>
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
