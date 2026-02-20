import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MapPin, Calendar, Mountain, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import tmbHero from '@/assets/tmb-hero.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7 },
};

const sevenDayPerks = [
  'Like-minded group of runners',
  'Lodging carry-on along the route',
  'Luggage transport included',
  'Professional guide included',
  '8 overnights (6 included in price)',
  'Multiple payment options',
];

const fourDayPerks = [
  'Like-minded group of runners',
  'Lodging carry-on along the route',
  'Luggage transport included',
  'Professional guide included',
  '5 overnights (3 included in price)',
  'Multiple payment options',
];

const TourDuMontBlanc = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src={tmbHero}
          alt="Mont Blanc mountain trail"
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
            Expedition · France, Italy, Switzerland
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.95]"
          >
            Tour du Mont Blanc
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-lg mt-4 max-w-xl"
          >
            The world's most iconic trail. Three countries. One group.
          </motion.p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { icon: Calendar, label: 'Dates', value: '1–9 Aug 2026' },
            { icon: MapPin, label: 'Start', value: 'Chamonix, France' },
            { icon: Mountain, label: 'Daily', value: '25km + 1500hm' },
            { icon: Clock, label: 'Duration', value: '4 or 7 days' },
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
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">The expedition</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              Around the Mont Blanc massif.
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                The Tour du Mont Blanc is the most notorious trail in the world — a multi-day trek
                circling the Mont Blanc massif through France, Italy, and Switzerland. We're taking 
                a group to experience it together.
              </p>
              <p>
                Choose the 7-day full circuit (starting August 1st) or the 4-day expert route 
                (starting August 4th, with more elevation per day). Both finish on August 9th 
                in Chamonix.
              </p>
              <p>
                Everything is taken care of: guide, luggage transport, lodging along the route. 
                You just show up and walk. With good people, through extraordinary scenery.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">Two options</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-16">
              Pick your pace.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 7-day */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-background rounded-2xl p-8 md:p-10 flex flex-col border-2 border-accent"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Full circuit</p>
              <h3 className="font-display text-2xl font-medium mb-1">7 days</h3>
              <p className="text-muted-foreground text-sm mb-2">1 – 9 August 2026</p>
              <p className="text-xs text-muted-foreground mb-6">25km + 1500hm per day · Routinier & expert</p>
              <p className="font-display text-4xl font-bold text-accent mb-8">€1,499</p>
              <ul className="space-y-3 mb-10 flex-1">
                {sevenDayPerks.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-medium px-8 py-3 rounded-full hover:brightness-110 transition-all text-sm"
              >
                Register — €1,499
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* 4-day */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-background rounded-2xl p-8 md:p-10 flex flex-col"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Fast track</p>
              <h3 className="font-display text-2xl font-medium mb-1">4 days</h3>
              <p className="text-muted-foreground text-sm mb-2">4 – 9 August 2026</p>
              <p className="text-xs text-muted-foreground mb-6">25km + 2500hm per day · Expert only</p>
              <p className="font-display text-4xl font-bold text-accent mb-8">€999</p>
              <ul className="space-y-3 mb-10 flex-1">
                {fourDayPerks.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-medium px-8 py-3 rounded-full hover:brightness-110 transition-all text-sm"
              >
                Register — €999
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.p
            {...fadeUp}
            className="text-sm text-muted-foreground mt-8 text-center"
          >
            Payment via bank transfer, Visa, Mastercard, Amex, Bancontact or Google Pay.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase mb-4">
              Walk the massif with us.
            </h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto">
              August 2026. Chamonix. Three countries. The most iconic trail on the planet.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-medium text-lg px-10 py-4 rounded-full hover:brightness-110 transition-all"
            >
              Register for the TMB
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-white/40 mt-6">
              Limited spots. Sign up early to secure yours.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TourDuMontBlanc;
