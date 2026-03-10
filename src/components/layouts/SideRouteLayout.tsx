import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

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
 * Provides consistent hero, navigation, and footer structure.
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

    {/* Hero */}
    <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      <img
        src={heroImage}
        alt={heroAlt}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 px-page pb-16 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-caption text-white/60 mb-4"
        >
          {heroLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.95]"
        >
          {title}
        </motion.h1>
        {heroSubtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-lg mt-4 max-w-xl"
          >
            {heroSubtitle}
          </motion.p>
        )}
      </div>
    </section>

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

/** Horizontal facts strip below the hero */
export const QuickFacts = ({ facts }: { facts: QuickFact[] }) => (
  <section className="border-b border-border">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
      {facts.map((fact) => (
        <div key={fact.label} className="px-6 py-6 text-center">
          <fact.icon className="w-4 h-4 mx-auto mb-2 text-accent" />
          <p className="text-caption text-muted-foreground mb-1">{fact.label}</p>
          <p className="text-base">{fact.value}</p>
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
