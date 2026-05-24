import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { MagneticButton } from '@/components/MagneticButton';
import { useStages } from '@/hooks/useSanityData';
import sailboatSea from '@/assets/sailboat-sea.jpg';

const EUStages = () => {
  const { data: stages } = useStages();
  const euStages = stages?.filter(s => !s.isIceland) ?? [];
  const available = euStages.filter(s => s.status === 'available');
  const completed = euStages.filter(s => s.status === 'completed');
  const currentCountry = euStages.find(s => s.status === 'available')?.country ?? 'Italy';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="EU Stages"
        description="The main Follow the Coast route. Italy to Greece along the European coastline. 100 km at a time."
        path="/eu-stages"
      />
      <Navigation />

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={sailboatSea} alt="European coastline" className="w-full h-full object-cover"  loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-page pb-12 max-w-content mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-caption text-primary-foreground/60 mb-3">
              <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />The main route
            </p>
            <h1 className="text-4xl md:text-5xl text-primary-foreground tracking-tight">
              EU Stages
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-page py-section max-w-content mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The main route follows Europe's coastline counter-clockwise. Started in Knokke in 2019,
              currently running through {currentCountry}. Athens by end of 2026.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Each stage is 100 km. One runner or team. A van, a photographer, food and water along the way.
              Your name goes in the book.
            </p>
            <MagneticButton
              href="/register"
              className="inline-flex items-center justify-center bg-accent text-white rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-80 transition-opacity"
            >
              Register a stage
            </MagneticButton>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border-t border-border pt-6">
              <p className="text-3xl tracking-tight">{completed.length}</p>
              <p className="text-caption text-muted-foreground mt-2">Completed</p>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-3xl tracking-tight">{available.length}</p>
              <p className="text-caption text-muted-foreground mt-2">Open now</p>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-3xl tracking-tight">168</p>
              <p className="text-caption text-muted-foreground mt-2">Total stages</p>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-3xl tracking-tight">11</p>
              <p className="text-caption text-muted-foreground mt-2">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available stages */}
      {available.length > 0 && (
        <section className="px-page pb-section max-w-content mx-auto">
          <hr className="rule mb-8" />
          <p className="text-label mb-6">
            <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Open for registration
          </p>
          <div className="space-y-0">
            {available.map(stage => (
              <a key={stage.id} href={`/register?stage=${stage.stageNumber}`}
                className="group flex items-center justify-between py-5 border-b border-border/50 hover:bg-secondary/30 transition-colors px-2 -mx-2">
                <div>
                  <p className="text-sm group-hover:text-accent transition-colors duration-300">
                    #{stage.stageNumber} — {stage.startLocation} → {stage.endLocation}
                  </p>
                  <p className="text-caption text-muted-foreground mt-1">{stage.country}{stage.region ? ` · ${stage.region}` : ''}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {stage.runDate && (
                    <span className="text-caption text-muted-foreground hidden sm:block">
                      {new Date(stage.runDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider px-3 py-1 bg-accent text-white">
                    Open
                  </span>
                </div>
              </a>
            ))}
          </div>
          {available.length === 0 && (
            <p className="text-sm text-muted-foreground py-8">
              No stages currently open. <a href="/register" className="underline underline-offset-4">Join the waitlist</a> to be notified when new stages open.
            </p>
          )}
        </section>
      )}

      {/* What's included */}
      <section className="px-page py-section bg-secondary">
        <div className="max-w-content mx-auto">
          <p className="text-label mb-8">
            <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />What's included
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Full crew support', body: 'Van with driver for 24 hours. Food, water, and coffee at regular intervals.' },
              { title: 'Documentary photography', body: 'A photographer alongside you for the full stage. Images delivered after.' },
              { title: 'Your name in the book', body: 'Every shoreholder is documented. Your stage, your name, permanently.' },
            ].map(item => (
              <div key={item.title} className="border-t border-border pt-6">
                <h3 className="text-base mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-page py-section max-w-content mx-auto">
        <hr className="rule mb-8" />
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-label mb-4">Pricing</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-3 border-b border-border/50">
                <span>Solo (1 runner)</span><span>€699</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span>Duo (2 runners)</span><span>€999</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span>Team (3+ runners)</span><span>€1,299</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Price covers crew, fuel, photographer, food, and lodging for the day.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <MagneticButton
              href="/register"
              className="inline-flex items-center justify-center bg-accent text-white rounded-full px-8 py-3 text-sm tracking-wide hover:opacity-80 transition-opacity"
            >
              Register a stage
            </MagneticButton>
            <MagneticButton
              href="/all-stages"
              className="inline-flex items-center justify-center border border-border rounded-full px-8 py-3 text-sm tracking-wide hover:border-foreground/50 transition-colors"
            >
              Browse all stages
            </MagneticButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EUStages;
