import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { MapPin, Calendar, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import ftkHero from '@/assets/ftk-hero.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7 },
};

const halfCoast = [
  'GPX route prepared for your device',
  'Food & drink checkpoints along the route',
  'Bag transport to the finish',
  'Finish gathering in Knokke',
];

const fullCoast = [
  'GPX route prepared for your device',
  'Food & drink checkpoints along the route',
  'Bag transport to the finish',
  'Finish gathering in Knokke',
];

const FollowTheKust = () => {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Follow The Kust"
        description="One-day run along the Belgian coast. 35km or 75km. De Panne to Knokke. 6 February 2027."
        path="/follow-the-kust"
      />
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src={ftkHero}
          alt="Runner on the Belgian coast at sunset"
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
            Side route · Belgium
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.95]"
          >
            Follow The Kust
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-lg mt-4 max-w-xl"
          >
            The Belgian coast.{'\n'}One day on foot.
          </motion.p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { icon: Calendar, label: 'Date', value: 'Saturday 6 February 2027' },
            { icon: MapPin, label: 'Route', value: 'De Panne → Knokke' },
            { icon: Clock, label: 'Distances', value: '35 km or 75 km' },
            { icon: Users, label: 'Levels', value: 'Open to all' },
          ].map((fact) => (
            <div key={fact.label} className="px-6 py-8 text-center">
              <fact.icon className="w-5 h-5 mx-auto mb-2 text-accent" />
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{fact.label}</p>
              <p className="font-display text-lg font-medium">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The concept */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">The concept</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              The Belgian coastline, shared.
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Follow The Kust is a one-day run along the Belgian shoreline.
              </p>
              <p>
                Two distances follow the same direction toward Knokke:
              </p>
              <ul className="space-y-1 pl-1">
                <li>35 km — Ostend to Knokke</li>
                <li>75 km — De Panne to Knokke</li>
              </ul>
              <p>
                You choose your distance.<br />
                You arrive at the start.<br />
                You move along the coast together.
              </p>
              <p>
                We prepare the route, organise checkpoints with ravito, transport bags, and welcome everyone at the finish.
              </p>
              <p>
                No timing.<br />
                No rankings.<br />
                Just a day following the coast.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">Two distances</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-16">
              Choose your section of coastline.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Half coast */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-background rounded-2xl p-8 md:p-10 flex flex-col"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Half coast</p>
              <h3 className="font-display text-2xl font-medium mb-1">35 km</h3>
              <p className="text-muted-foreground text-sm mb-2">Ostend → Knokke</p>
              <p className="text-xs text-muted-foreground mb-6">Suitable for first long distances and experienced runners alike.</p>
              <p className="font-display text-4xl font-bold text-accent mb-8">€39</p>
              <ul className="space-y-3 mb-10 flex-1">
                {halfCoast.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/checkout?product=Follow%20The%20Kust&variant=Half%20Coast%20%E2%80%93%2035km&price=%E2%82%AC39&return=/follow-the-kust"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-medium px-8 py-3 rounded-full hover:brightness-110 transition-all text-sm"
              >
                Register — €39
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Full coast */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-background rounded-2xl p-8 md:p-10 flex flex-col border-2 border-accent"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Full coast</p>
              <h3 className="font-display text-2xl font-medium mb-1">75 km</h3>
              <p className="text-muted-foreground text-sm mb-2">De Panne → Knokke</p>
              <p className="text-xs text-muted-foreground mb-6">For runners comfortable spending a full day moving along the coast.</p>
              <p className="font-display text-4xl font-bold text-accent mb-8">€59</p>
              <ul className="space-y-3 mb-10 flex-1">
                {fullCoast.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/checkout?product=Follow%20The%20Kust&variant=Full%20Coast%20%E2%80%93%2075km&price=%E2%82%AC59&return=/follow-the-kust"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-medium px-8 py-3 rounded-full hover:brightness-110 transition-all text-sm"
              >
                Register — €59
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.p
            {...fadeUp}
            className="text-sm text-muted-foreground mt-8 text-center"
          >
            Optional: community dinner after the run — €55. Add it during registration.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase mb-4 relative">
              Run the{' '}
              <span className="relative inline-block">
                <span className="text-foreground/30">coast</span>
                <span className="absolute left-0 top-1/2 w-full h-[2px] bg-accent" />
                <span
                  className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 text-accent font-display text-2xl md:text-4xl font-bold uppercase"
                  style={{ transform: 'translateX(-50%) rotate(-6deg)' }}
                >
                  kust
                </span>
              </span>{' '}
              with us.
            </h2>
            <div className="text-muted-foreground mb-10 max-w-md mx-auto space-y-4">
              <p>
                Follow The Kust is an open moment within Follow the Coast.
              </p>
              <p>
                A chance to experience the coastline together, without committing to a full stage.
              </p>
              <p>
                One direction.<br />
                One shoreline.<br />
                Many rhythms.
              </p>
              <p className="font-medium text-foreground">
                6 February 2027<br />
                The Belgian coast awaits.
              </p>
            </div>
            <Link
              to="/checkout?product=Follow%20The%20Kust&return=/follow-the-kust"
              className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-medium text-lg px-10 py-4 rounded-full hover:brightness-110 transition-all"
            >
              Register for Follow The Kust
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FollowTheKust;
