import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Users, User, UsersRound, ChevronDown } from 'lucide-react';
import wavesLogo from '@/assets/waves-logo.png';
import beachRunners from '@/assets/beach-runners.jpg';

const pricingTiers = [
  {
    id: 'solo',
    icon: User,
    label: 'Solo',
    people: '1 person',
    price: 699,
    description: 'Run your own stage, at your own pace.',
  },
  {
    id: 'duo',
    icon: Users,
    label: 'Duo',
    people: '2 people',
    price: 999,
    description: 'Share the experience with a partner.',
    popular: true,
  },
  {
    id: 'team',
    icon: UsersRound,
    label: 'Team',
    people: '3+ people',
    price: 1299,
    description: 'Bring the crew. More fun, more sustainable.',
  },
];

const included = [
  'Run 100 km along the coast',
  '24h logistical & emotional support',
  'Professional photographer, full time',
  'Tailored story on socials for friends & family',
  'Plenty of delicious food during the run',
  'HD pictures of the day, digital format',
  'Help during your preparation',
  'Access to the FTC runner community',
  'A Duvel at the finish line',
  'One book per registered participant',
];

const sampleStages = [
  { nr: 221, date: '01-11-2026', from: 'Korogonianika', to: 'Plitra', status: 'open' },
  { nr: 222, date: '02-11-2026', from: 'Plitra', to: 'Ag. Kiriaki', status: 'taken' },
  { nr: 223, date: '03-11-2026', from: 'Ag. Kiriaki', to: 'Paralia', status: 'taken' },
  { nr: 224, date: '04-11-2026', from: 'Paralia', to: 'Kirche Panagia > Iria', status: 'open' },
  { nr: 225, date: '06-11-2026', from: 'Kirche Panagia > Iria', to: 'Achladitsa', status: 'taken' },
  { nr: 226, date: '07-11-2026', from: 'Achladitsa', to: 'Nisida', status: 'taken' },
  { nr: 227, date: '08-11-2026', from: 'Nisida', to: 'Stikas > Megara', status: 'taken' },
  { nr: 231, date: '13-11-2026', from: 'Ag. Konstantinos', to: 'Mpoufalo', status: 'open' },
  { nr: 235, date: '17-11-2026', from: 'Mili <> Pigadia', to: 'Egglisia Agia Varvara > Vigla', status: 'open' },
];

const Register = () => {
  const [selectedTier, setSelectedTier] = useState('duo');
  const [showAllStages, setShowAllStages] = useState(false);

  const visibleStages = showAllStages ? sampleStages : sampleStages.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto brightness-0" />
          <span className="font-display text-[10px] font-bold uppercase tracking-wider leading-tight">
            <span className="block">Follow</span>
            <span className="block">The</span>
            <span className="block">Coast</span>
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </header>

      {/* Hero with image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={beachRunners}
          alt="Runners on the coast"
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm text-white/60 tracking-wide mb-3">Register</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              Run your stage.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* How it works + Pricing */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">How it works</h2>
            <p className="text-muted-foreground leading-relaxed">
              To keep running around Europe, we need to recover on average €850 per stage — covering crew, fuel, lodging, maintenance, and all the food to fuel you during your effort. We want to enable everyone to join, so we created flexible pricing that rewards teams.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {pricingTiers.map((tier, i) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              return (
                <motion.button
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative text-left rounded-2xl p-8 border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/40'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}
                  <Icon size={24} className="text-accent mb-4" />
                  <h3 className="font-display text-xl font-bold mb-1">{tier.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tier.people}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {tier.description}
                  </p>
                  <div className="font-display text-3xl font-bold">
                    €{tier.price}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">What you get</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {included.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3 py-3 border-b border-border"
                >
                  <Check size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stage selection */}
      <section className="bg-foreground text-primary-foreground px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm text-white/50 tracking-wide mb-4">Select a stage</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Pick your date.
            </h2>
            <p className="text-white/60 max-w-lg">
              Each stage is ~100 km along the European coast. Choose an open stage below and we'll take care of the rest.
            </p>
          </motion.div>

          {/* Stage list */}
          <div className="space-y-0">
            <div className="grid grid-cols-[60px_1fr_1fr_100px] md:grid-cols-[80px_120px_1fr_1fr_120px] gap-4 text-xs text-white/40 uppercase tracking-wider pb-4 border-b border-white/10">
              <span>Stage</span>
              <span className="hidden md:block">Date</span>
              <span>From</span>
              <span>To</span>
              <span className="text-right">Status</span>
            </div>
            <AnimatePresence>
              {visibleStages.map((stage, i) => (
                <motion.div
                  key={stage.nr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`grid grid-cols-[60px_1fr_1fr_100px] md:grid-cols-[80px_120px_1fr_1fr_120px] gap-4 py-4 border-b border-white/10 items-center ${
                    stage.status === 'open' ? 'hover:bg-white/5 cursor-pointer transition-colors' : 'opacity-50'
                  }`}
                >
                  <span className="font-display font-bold">#{stage.nr}</span>
                  <span className="text-sm text-white/60 hidden md:block">{stage.date}</span>
                  <span className="text-sm text-white/80">{stage.from}</span>
                  <span className="text-sm text-white/80">{stage.to}</span>
                  <span className="text-right">
                    {stage.status === 'open' ? (
                      <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                        Open
                      </span>
                    ) : (
                      <span className="text-xs text-white/40">Taken</span>
                    )}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!showAllStages && (
            <button
              onClick={() => setShowAllStages(true)}
              className="mt-6 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <span>Show more stages</span>
              <ChevronDown size={16} />
            </button>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 flex flex-col sm:flex-row items-center gap-6"
          >
            <a
              href="https://chat.whatsapp.com/BazCDyy7n0wDcAhFwyq1xV"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Join WhatsApp group
            </a>
            <p className="text-sm text-white/50">
              Questions? Reach out and we'll help you pick the right stage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final note */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold leading-relaxed"
          >
            Come as you are. We are looking forward to joining you on an unforgettable journey.
          </motion.p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8"
          >
            <ArrowLeft size={16} />
            <span className="border-b border-foreground/30 pb-1">Back to home</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Register;
