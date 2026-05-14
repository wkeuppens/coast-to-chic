import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Users, User, UsersRound, ChevronDown, BookOpen, X, MapPin } from 'lucide-react';
import { EditorialArrow } from '@/components/EditorialArrow';
import { MagneticButton } from '@/components/MagneticButton';
import wavesLogo from '@/assets/waves-logo.png';
import beachRunners from '@/assets/beach-runners.jpg';
import { SEO } from '@/components/SEO';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { archive, checkout, waitlist, type ApiStage } from '@/lib/api';

const pricingTiers = [
  {
    id: 'solo',
    stripeId: 'stage_solo' as const,
    icon: User,
    label: 'Solo',
    people: '1 runner',
    price: 699,
    description: 'Run your own stage.\nYour rhythm, your day along the coast.',
  },
  {
    id: 'duo',
    stripeId: 'stage_duo' as const,
    icon: Users,
    label: 'Duo',
    people: '2 runners',
    price: 999,
    description: 'Share the distance.\nSupport each other through the day.',
    popular: true,
  },
  {
    id: 'team',
    stripeId: 'stage_group' as const,
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

const Register = () => {
  const [selectedTier, setSelectedTier] = useState('duo');
  const [showAllStages, setShowAllStages] = useState(false);
  const [stages, setStages] = useState<ApiStage[]>([]);
  const [loadingStages, setLoadingStages] = useState(true);
  const [activeStage, setActiveStage] = useState<ApiStage | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Checkout state (inside modal)
  const [form, setForm] = useState({ name: '', email: '' });
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'submitting' | 'done' | 'waitlist_done'>('idle');
  const [checkoutError, setCheckoutError] = useState('');

  // Fetch real stages from API
  useEffect(() => {
    archive.tiles()
      .then(data => {
        // Show available stages first, then completed, skip Iceland
        const filtered = data.filter(s => !s.isIceland);
        setStages(filtered);
      })
      .catch(() => { /* keep empty — show no stages rather than wrong data */ })
      .finally(() => setLoadingStages(false));
  }, []);

  const availableStages = stages.filter(s => s.status === 'available');
  const visibleStages = showAllStages ? availableStages : availableStages.slice(0, 6);

  // Map — re-render when active stage changes
  useEffect(() => {
    if (!activeStage || !mapRef.current) return;
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

    const start = activeStage.startCoord;
    const end = activeStage.endCoord;
    if (!start || !end) return;

    const map = L.map(mapRef.current, { zoomControl: false });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const startIcon = L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;background:#C45D3E;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    });
    const endIcon = L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;background:#0E0E0E;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    });

    const startMarker = L.marker([start.lat, start.lng], { icon: startIcon }).addTo(map);
    const endMarker = L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map);
    startMarker.bindPopup(`<strong>Start:</strong> ${activeStage.startLocation}`);
    endMarker.bindPopup(`<strong>End:</strong> ${activeStage.endLocation}`);

    L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
      color: '#C45D3E', weight: 2.5, dashArray: '6 6',
    }).addTo(map);

    map.fitBounds([[start.lat, start.lng], [end.lat, end.lng]], { padding: [60, 60], maxZoom: 13 });

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [activeStage]);

  const openStage = (stage: ApiStage) => {
    setActiveStage(stage);
    setForm({ name: '', email: '' });
    setCheckoutStatus('idle');
    setCheckoutError('');
  };

  const closeModal = () => { setActiveStage(null); setCheckoutStatus('idle'); };

  const selectedTierData = pricingTiers.find(t => t.id === selectedTier)!;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStage) return;
    setCheckoutStatus('submitting'); setCheckoutError('');
    try {
      const res = await checkout.stage({
        stageNumber: activeStage.stageNumber,
        tier: selectedTierData.stripeId,
        customerEmail: form.email,
        customerName: form.name,
      });
      if (res.paymentUrl) { window.location.href = res.paymentUrl; }
      else setCheckoutError(res.error ?? 'Something went wrong.');
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally { setCheckoutStatus('idle'); }
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStage) return;
    setCheckoutStatus('submitting'); setCheckoutError('');
    try {
      await waitlist.joinStage(activeStage.stageNumber, form.email, form.name);
      setCheckoutStatus('waitlist_done');
    } catch {
      setCheckoutError('Something went wrong.');
      setCheckoutStatus('idle');
    }
  };

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
          <img src={wavesLogo} alt="Follow the Coast logo" className="h-8 w-auto brightness-0" />
          <span className="text-[10px] uppercase tracking-wider leading-tight">
            <span className="block">Follow</span><span className="block">The</span><span className="block">Coast</span>
          </span>
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /><span>Back</span>
        </Link>
      </header>

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={beachRunners} alt="Runners on the coast" loading="eager" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-12 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-caption text-white/60 mb-3">Register</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05]">Run a stage</h1>
          </motion.div>
        </div>
      </section>

      {/* Participant Guide Callout */}
      <section className="px-6 md:px-12 lg:px-24 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 p-6 bg-accent/8 border border-accent/20">
            <BookOpen size={24} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground mb-1">Read the participant guide before registering</p>
              <p className="text-sm text-muted-foreground mb-3">It covers how stages work, what to expect, and what we ask from every runner.</p>
              <Link to="/participant-handbook">
                <MagneticButton className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity" strength={0.2}>
                  <EditorialArrow size={14} className="invert" />
                  Read the guide
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16 max-w-2xl">
            <p className="text-caption text-muted-foreground mb-4">How it works</p>
            <h2 className="text-3xl md:text-4xl mb-6">The process</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Each stage covers roughly 100 km of European coastline, carried by a different runner or team. When you register, you take responsibility for one link in that chain.</p>
              <p>Every stage contributes to the shared logistics: crew, travel, food, documentation, and the long-term archive.</p>
            </div>
          </motion.div>

          <p className="text-caption text-muted-foreground mb-4">Pricing</p>
          <h3 className="text-2xl mb-8">Choose how you run</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {pricingTiers.map((tier, i) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              return (
                <motion.button
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  onClick={() => setSelectedTier(tier.id)}
                  type="button"
                  className={`relative text-left p-8 border-2 transition-all duration-300 ${isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'}`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full">Most popular</span>
                  )}
                  <Icon size={24} className="text-accent mb-4" />
                  <h3 className="text-2xl mb-1">{tier.label}</h3>
                  <p className="text-caption text-muted-foreground mb-4">{tier.people}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">{tier.description}</p>
                  <div className="text-3xl text-accent">€{tier.price}</div>
                </motion.button>
              );
            })}
          </div>

          {/* What's included */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <p className="text-caption text-muted-foreground mb-4">Included</p>
            <h2 className="text-2xl mb-8">What's included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {included.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }} className="flex items-start gap-3 py-3 border-b border-border">
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
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
            <p className="text-caption text-muted-foreground mb-4">Select a stage</p>
            <h2 className="text-3xl md:text-4xl mb-4">Pick your date</h2>
            <p className="text-muted-foreground max-w-lg">Each open stage represents a stretch of coastline still waiting to be carried forward.</p>
          </motion.div>

          {loadingStages ? (
            <div className="py-8 text-sm text-muted-foreground">Loading available stages…</div>
          ) : availableStages.length === 0 ? (
            <div className="py-8 text-sm text-muted-foreground">No stages currently available. Check back soon or join the WhatsApp group for updates.</div>
          ) : (
            <>
              <div className="space-y-0">
                <div className="grid grid-cols-[60px_1fr_1fr_100px] md:grid-cols-[80px_120px_1fr_1fr_120px] gap-4 text-caption text-muted-foreground pb-4 border-b border-border">
                  <span>Stage</span>
                  <span className="hidden md:block">Date</span>
                  <span>From</span>
                  <span>To</span>
                  <span className="text-right">Action</span>
                </div>
                <AnimatePresence>
                  {visibleStages.map((stage, i) => (
                    <motion.div key={stage.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => openStage(stage)}
                      className="grid grid-cols-[60px_1fr_1fr_100px] md:grid-cols-[80px_120px_1fr_1fr_120px] gap-4 py-4 border-b border-border items-center cursor-pointer hover:bg-background transition-colors group">
                      <span className="tabular-nums text-sm">#{stage.stageNumber}</span>
                      <span className="text-sm text-muted-foreground hidden md:block">{stage.runDate ?? '—'}</span>
                      <span className="text-sm flex items-center gap-1.5">
                        <MapPin size={12} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        {stage.startLocation}
                      </span>
                      <span className="text-sm">{stage.endLocation}</span>
                      <span className="text-right">
                        <span className="inline-block bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full">Open</span>
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {!showAllStages && availableStages.length > 6 && (
                <button onClick={() => setShowAllStages(true)} type="button"
                  className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <span>Show all {availableStages.length} stages</span>
                  <ChevronDown size={16} />
                </button>
              )}
            </>
          )}

          {/* WhatsApp fallback */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-16">
            <h3 className="text-2xl mb-4">Questions?</h3>
            <p className="text-muted-foreground mb-8">Not sure which stage fits you? Join the WhatsApp group or reach out directly.</p>
            <a href="https://chat.whatsapp.com/BazCDyy7n0wDcAhFwyq1xV?mode=gi_t" target="_blank" rel="noopener noreferrer">
              <MagneticButton className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm hover:opacity-90 transition-opacity" strength={0.2}>
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
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl md:text-3xl leading-relaxed">
            Come as you are.<br />We're looking forward to meeting you on the coastline.
          </motion.p>
        </div>
      </section>

      {/* Stage detail + checkout modal */}
      <AnimatePresence>
        {activeStage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-background border border-border w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <p className="text-caption text-accent">Stage #{activeStage.stageNumber}</p>
                  <h3 className="text-lg">{activeStage.startLocation} → {activeStage.endLocation}</h3>
                  {activeStage.runDate && <p className="text-xs text-muted-foreground mt-0.5">{activeStage.runDate}</p>}
                  {activeStage.distanceKm && <p className="text-xs text-muted-foreground">~{activeStage.distanceKm}km</p>}
                </div>
                <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Map */}
              {activeStage.startCoord && (
                <div ref={mapRef} className="h-[280px] w-full" />
              )}

              {/* Coordinates note */}
              {activeStage.startCoord && (
                <div className="px-6 py-3 border-t border-border flex items-center gap-6 text-xs text-muted-foreground bg-secondary/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                    Start: {activeStage.startCoord.lat.toFixed(4)}, {activeStage.startCoord.lng.toFixed(4)}
                  </span>
                  {activeStage.endCoord && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-foreground inline-block" />
                      End: {activeStage.endCoord.lat.toFixed(4)}, {activeStage.endCoord.lng.toFixed(4)}
                    </span>
                  )}
                </div>
              )}

              {/* Checkout */}
              <div className="px-6 py-6">
                {checkoutStatus === 'waitlist_done' ? (
                  <p className="text-sm text-foreground">You're on the waitlist. We'll email you if this stage opens up.</p>
                ) : activeStage.status === 'available' ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {selectedTierData.label} — €{selectedTierData.price}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedTierData.people}</p>
                    </div>
                    <input type="text" placeholder="Your name" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    <input type="email" placeholder="Email address" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    {checkoutError && <p className="text-xs text-red-500">{checkoutError}</p>}
                    <button type="submit" disabled={checkoutStatus === 'submitting'}
                      className="w-full bg-accent text-white text-sm py-3 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50">
                      {checkoutStatus === 'submitting' ? 'Processing…' : `Register — €${selectedTierData.price}`}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      You'll be redirected to Stripe to complete payment securely.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleWaitlist} className="space-y-4">
                    <p className="text-sm text-muted-foreground">This stage is currently taken. Join the waitlist to be notified if it becomes available.</p>
                    <input type="text" placeholder="Your name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    <input type="email" placeholder="Email address" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    {checkoutError && <p className="text-xs text-red-500">{checkoutError}</p>}
                    <button type="submit" disabled={checkoutStatus === 'submitting'}
                      className="w-full bg-secondary text-foreground text-sm py-3 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50">
                      {checkoutStatus === 'submitting' ? '…' : 'Join waitlist'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
