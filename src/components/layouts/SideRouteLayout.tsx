import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { TideLine } from '@/components/system';

interface SideRouteLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  path: string;
  heroImage: string;
  heroAlt: string;
  heroLabel: string;
  heroSubtitle?: string;
}

/**
 * Shared layout for side route pages (Home Run, Follow The Kust, TMB).
 * Line / Edge / Index: full-bleed hero, edge-pinned title and monospaced
 * reference label, followed by a TideLine before page content.
 */
export const SideRouteLayout = ({
  children,
  title,
  description,
  path,
  heroImage,
  heroAlt,
  heroLabel,
  heroSubtitle,
}: SideRouteLayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title={title} description={description} path={path} />
    <Navigation />

    {/* Hero — full-bleed plate, content pinned to bottom-left edge */}
    <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      <img
        src={heroImage}
        alt={heroAlt}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Top-left reference strip */}
      <div className="absolute top-0 left-0 right-0 pt-24 px-page flex items-baseline gap-6 text-white/85">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em]">
          {heroLabel}
        </span>
        <span className="flex-1 border-t border-current opacity-40" />
      </div>

      <div className="relative z-10 px-page pb-16 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display text-white text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.92] tracking-tight"
        >
          {title}
        </motion.h1>
        {heroSubtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-white/80 text-base md:text-lg mt-5 max-w-xl leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        )}
      </div>
    </section>

    <TideLine />

    {children}

    <Footer />
  </div>
);

/* ── Shared sub-components ── */

interface QuickFact {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

/**
 * Horizontal facts strip below the hero, restyled as a monospaced index row.
 * Labels in IBM Plex Mono uppercase, values in body sans, hairline dividers.
 */
export const QuickFacts = ({ facts }: { facts: QuickFact[] }) => (
  <section className="border-b border-foreground/15">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-foreground/15">
      {facts.map((fact) => (
        <div key={fact.label} className="px-6 py-7 flex flex-col items-start gap-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            {fact.label}
          </span>
          <span className="text-base md:text-lg leading-tight">{fact.value}</span>
        </div>
      ))}
    </div>
  </section>
);


/** Standard animation preset for scroll-triggered sections */
export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' as const },
  transition: { duration: 0.7 },
};

/** Content section with consistent padding */
export const ContentSection = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`py-section px-page ${className}`}>
    <div className="max-w-3xl mx-auto">{children}</div>
  </section>
);

/** Wide content section (for pricing grids, etc.) */
export const WideSection = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`py-section px-page ${className}`}>
    <div className="max-w-content mx-auto">{children}</div>
  </section>
);
