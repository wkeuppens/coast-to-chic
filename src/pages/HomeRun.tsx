import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MapPin, Calendar, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import harborBoats from '@/assets/harbor-boats.jpg';

const inclusions = [
  'Fixed GPX route prepared for your device',
  'Food, drinks and checkpoints every 15 km',
  'Transport for your personal pack',
  'Easy start and return near Venice',
  'Informal gathering after the run',
  'Community lunch the following day',
  'Your name included in the Follow the Coast book as Shoreholder',
];

const timeline = [
  { step: '1', text: 'You are added to the Home Run WhatsApp group' },
  { step: '2', text: 'You receive the GPX route' },
  { step: '3', text: 'Checkpoint locations and logistics follow' },
  { step: '4', text: 'Meet at 07:00 at the Venice bridge' },
  { step: '5', text: 'Informal drinks together that evening' },
  { step: '6', text: 'Community lunch — 21 April' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7 },
};

const HomeRun = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src={harborBoats}
          alt="Venice waterfront"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-16 max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-sm tracking-wide uppercase mb-4"
          >
            Side route · Venice
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.95]"
          >
            Home Run
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-lg mt-4 max-w-xl"
          >
            A shared 100km stage.
          </motion.p>
        </div>
      </section>

      {/* Quick facts strip */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { icon: Calendar, label: 'Date', value: '20 April 2026' },
            { icon: MapPin, label: 'Start', value: 'Venice Bridge' },
            { icon: Clock, label: 'Distance', value: '100 km' },
            { icon: Users, label: 'Price', value: '€199' },
          ].map((fact) => (
            <div key={fact.label} className="px-6 py-8 text-center">
              <fact.icon className="w-5 h-5 mx-auto mb-2 text-accent" />
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{fact.label}</p>
              <p className="font-display text-lg font-medium">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Concept */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">The concept</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              What is a Home Run?
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>Occasionally, we open a stage differently.</p>
              <p>
                A Home Run allows more runners to carry the coastline together for a single day.
              </p>
              <p>
                The distance remains the same.<br />
                The spirit remains the same.<br />
                Only the logistics become simpler.
              </p>
              <p>
                Start and finish are close to Venice.
                You run alongside others who signed up, each at their own rhythm.
              </p>
              <p>
                Checkpoints every 15 km provide food, drinks, and support along the way.
              </p>
              <p>
                It is a lighter way to enter Follow the Coast.<br />
                One day on the route.<br />
                One shared stage.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">What is included</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
              Everything needed to focus on the run.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            {inclusions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-start gap-4 p-5 bg-background rounded-2xl"
              >
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Route */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">The route</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              Venice & the Mainland
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>Start at 07:00 at the bridge leading into Venice.</p>
              <p>
                The first kilometres move toward the city before returning to the mainland around the 40 km mark.
              </p>
              <p>
                From there, the route follows flat riverside roads and coastal landscapes, passing near the airport before continuing northeast.
              </p>
              <p>
                Finish near La Vezze di Venezia, where the stage closes and the next section of coastline waits.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why this exists */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-white/40 tracking-wide uppercase mb-4">Why this exists</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              Most stages sell out quickly.
            </h2>
            <div className="space-y-5 text-white/70 leading-relaxed">
              <p>
                That momentum keeps the project moving, but it also means some runners never find their way onto the route.
              </p>
              <p>The Home Run opens another path.</p>
              <p>
                For those who missed a stage.<br />
                For those who prefer to run together.<br />
                For those curious about what it feels like to follow the coast for a day.
              </p>
              <p>
                Same project.<br />
                Different entry point.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* After Registration */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">After registration</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-12">
              What happens next:
            </h2>
          </motion.div>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-start gap-6 py-5 border-b border-border last:border-b-0"
              >
                <span className="font-display text-2xl font-medium text-accent w-8 shrink-0">
                  {item.step}
                </span>
                <span className="text-foreground pt-1">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase mb-4">
              Run Venice with us.
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              100 km along the coast.<br />
              Shared effort.<br />
              One day on the route.
            </p>
            <p className="font-display text-2xl font-medium text-foreground mb-2 mt-6">€199</p>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto text-sm">
              Checkpoints, community, and your name in the book.
            </p>
            <Link
              to="/checkout?product=Home%20Run%20%E2%80%93%20Venice&variant=100km&price=%E2%82%AC199&return=/homerun"
              className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-medium text-lg px-10 py-4 rounded-full hover:brightness-110 transition-all"
            >
              Register for the Home Run
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              Minimum 7 runners required.<br />
              If this format works, Athens and Istanbul follow.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeRun;