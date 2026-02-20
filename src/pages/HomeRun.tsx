import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MapPin, Calendar, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import harborBoats from '@/assets/harbor-boats.jpg';

const inclusions = [
  'A fixed GPX route uploaded to your device',
  'Food, drinks & checkpoint support every 15km',
  'Transport for your personal pack',
  'Start near Venice for easy access',
  'Community meet-up & lunch the next day',
  'Your name in the Follow the Coast book as Shoreholder',
];

const timeline = [
  { step: '1', text: 'Added to the Home Run WhatsApp group' },
  { step: '2', text: 'Receive your GPX route for your device' },
  { step: '3', text: 'Receive checkpoint coordinates & logistics' },
  { step: '4', text: 'Start at 7am Monday at the Venice bridge' },
  { step: '5', text: 'Informal drinks in Venice that evening' },
  { step: '6', text: 'Community lunch Tuesday 21st April' },
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
            A more affordable 100km stage, shared with others.
          </motion.p>
        </div>
      </section>

      {/* Quick facts strip */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { icon: Calendar, label: 'Date', value: '20 Apr 2026' },
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

      {/* What is it */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">The concept</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              What is the Home Run?
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Every now and then we pick a Stage and turn it into a Home Run. It's intended to welcome
                a larger set of runners and further democratize Follow The Coast — allowing anyone who
                wants to run a Stage to join in.
              </p>
              <p>
                Same formula, easier logistics. Begin and end points are close to Venice so getting there
                and back is simple. You run with others who signed up, each at their own pace. Along the way,
                there are checkpoints every 15km with food, drinks, and support.
              </p>
              <p>
                It's straightforward, affordable, and an amazing opportunity for the community to come
                together. A good way to test yourself, become part of the project, and see what it feels
                like to move with the coast for a day.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">For €199 you get</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-12">
              Everything you need.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
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
              Venice & the mainland
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Start at 7am at the bridge to the floating city of Venice. After 35km of
                enjoying Venice's historical beauty, head back to the mainland at the 40km mark.
              </p>
              <p>
                On the mainland, run along flat riverside roads, passing the airport at 70km.
                Finish 60km northeast from Venice in La Vezze di Venezia.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-white/40 tracking-wide uppercase mb-4">Why we do this</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
              Opening the door wider.
            </h2>
            <div className="space-y-5 text-white/70 leading-relaxed">
              <p>
                When we put new Stages online, they sell out in days. That momentum is incredible —
                but it also means some people get left behind.
              </p>
              <p>
                Some saw their favourite stage claimed. Some find the registration price too high.
                Some find it hard to find companions for 100km. The Home Run is for all these people —
                and for bringing the community together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What happens when you register */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-4">After you register</p>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-12">
              What happens next?
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
            <p className="text-muted-foreground mb-10 max-w-md mx-auto">
              100km along the coast. €199. Checkpoints, community, and your name in the book.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-medium text-lg px-10 py-4 rounded-full hover:brightness-110 transition-all"
            >
              Register for the Home Run
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              Minimum 7 runners needed. If successful, Athens & Istanbul are next.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeRun;
