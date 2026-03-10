import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Users, User, UsersRound, ChevronDown, BookOpen } from 'lucide-react';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import wavesLogo from '@/assets/waves-logo.png';
import beachRunners from '@/assets/beach-runners.jpg';
import { SEO } from '@/components/SEO';

const pricingTiers = [
  {
    id: 'solo',
    icon: User,
    label: 'Solo',
    people: '1 runner',
    price: 699,
    description: 'Run your own stage.\nYour rhythm, your day along the coast.',
  },
  {
    id: 'duo',
    icon: Users,
    label: 'Duo',
    people: '2 runners',
    price: 999,
    description: 'Share the distance.\nSupport each other through the day.',
    popular: true,
  },
  {
    id: 'team',
    icon: UsersRound,
    label: 'Team',
    people: '3+ runners',
    price: 1299,
    description: 'Bring friends.\nDivide the effort.\nCarry the stage together.',
  },
];

const included: (string | React.ReactNode)[] = [
  'Run a ~100 km stage along Europe\'s coastline',
  'Dedicated crew supporting you throughout the day',
  'Food and drinks during the run',
  <span key="photographer">Professional <Link to="/photographers" className="underline underline-offset-2 hover:text-foreground transition-colors">photography</Link> documenting your stage</span>,
  'Personal story shared within the project archive',
  'Guidance during preparation',
  'Access to the FTC runner community',
  'Digital photo selection after your stage',
  'One Follow the Coast book per registered participant',
  'A Duvel at the finish line',
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
      <SEO
        title="Register"
        description="Register for your Follow the Coast stage. Solo, duo, or team. 100km along the European coastline."
        path="/register"
      />
      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto brightness-0" />
          <span className="text-[10px] uppercase tracking-wider leading-tight">
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
            <p className="text-caption text-white/60 mb-3">Register</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              Run a stage
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Participant Guide Callout */}
      <section className="px-6 md:px-12 lg:px-24 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 p-6 bg-accent/8 border border-accent/20">
            <BookOpen size={24} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Read the participant guide before registering
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                It covers how stages work, what to expect, and what we ask from every runner.
              </p>
              <Link to="/participant-handbook">
                <MagneticButton
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                  strength={0.2}
                >
                  <EditorialArrow size={14} className="invert" />
                  Read the guide
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works + Pricing */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <p className="text-caption text-muted-foreground mb-4">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The process</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Each stage covers roughly 100 km of European coastline, carried by a different runner or team. When you register, you take responsibility for one link in that chain.</p>
              <p>Every stage contributes to the shared logistics: crew, travel, food, documentation, and the long-term archive.</p>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <p className="text-caption text-muted-foreground mb-4">Pricing</p>
          <h3 className="text-2xl font-bold mb-8">Choose how you run</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
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
                  type="button"
                  className={`relative text-left p-8 border-2 transition-all duration-300 ${
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
                  <h3 className="text-2xl font-bold mb-1">{tier.label}</h3>
                  <p className="text-caption text-muted-foreground mb-4">{tier.people}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                    {tier.description}
                  </p>
                  <div className="text-3xl font-bold">
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
            <p className="text-caption text-muted-foreground mb-4">Included</p>
            <h2 className="text-2xl font-bold mb-8">What's included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {included.map((item, i) => (
                <motion.div
                  key={typeof item === 'string' ? item : String(i)}
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
      <section className="bg-secondary px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-caption text-muted-foreground mb-4">Select a stage</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pick your date
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Each open stage represents a stretch of coastline still waiting to be carried forward.
            </p>
          </motion.div>

          {/* Stage list */}
          <div className="space-y-0">
            <div className="grid grid-cols-[60px_1fr_1fr_100px] md:grid-cols-[80px_120px_1fr_1fr_120px] gap-4 text-caption text-muted-foreground pb-4 border-b border-border">
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
                  className={`grid grid-cols-[60px_1fr_1fr_100px] md:grid-cols-[80px_120px_1fr_1fr_120px] gap-4 py-4 border-b border-border items-center ${
                    stage.status === 'open' ? 'hover:bg-background cursor-pointer transition-colors' : 'opacity-50'
                  }`}
                >
                  <span className="font-bold">#{stage.nr}</span>
                  <span className="text-sm text-muted-foreground hidden md:block">{stage.date}</span>
                  <span className="text-sm">{stage.from}</span>
                  <span className="text-sm">{stage.to}</span>
                  <span className="text-right">
                    {stage.status === 'open' ? (
                      <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                        Open
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Taken</span>
                    )}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!showAllStages && (
            <button
              onClick={() => setShowAllStages(true)}
              type="button"
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-4">Questions?</h3>
            <p className="text-muted-foreground mb-8">
              Not sure which stage fits you? Join the WhatsApp group or reach out directly.
            </p>
            <a
              href="https://chat.whatsapp.com/BazCDyy7n0wDcAhFwyq1xV?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MagneticButton
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                strength={0.2}
              >
                <EditorialArrow size={14} className="invert" />
                Join WhatsApp group
              </MagneticButton>
            </a>
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
            className="text-2xl md:text-3xl font-bold leading-relaxed"
          >
            Come as you are.<br />We're looking forward to meeting you on the coastline.
          </motion.p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Register;
