import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { MagneticButton } from '@/components/MagneticButton';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { waitlist, checkout, type IcelandStage } from '@/lib/api';
import { useSiteSettings } from '@/hooks/useSanityData';
import { ICELAND_STAGES_STATIC } from '@/data/icelandStages';
import 'leaflet/dist/leaflet.css';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://vcrvszujqdunroopsxwh.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

async function fetchLiveStatuses(): Promise<Record<number, 'locked' | 'available' | 'booked'>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/sanity-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SUPABASE_KEY ? { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } : {}),
      },
      body: JSON.stringify({ query: '*[_type=="stage"&&isIceland==true]{stageNumber,status}' }),
    })
    if (!res.ok) return {}
    const json = await res.json()
    const result: Record<number, 'locked' | 'available' | 'booked'> = {}
    for (const r of (json.result ?? [])) {
      result[r.stageNumber] = r.status === 'completed' ? 'booked' : r.status
    }
    return result
  } catch {
    return {}
  }
}

function buildStages(
  statuses: Record<number, 'locked' | 'available' | 'booked'>,
  releaseAt: string | null
): { stages: IcelandStage[]; summary: { total: number; available: number; booked: number; locked: number } } {
  const now = Date.now()
  const releaseMs = releaseAt ? new Date(releaseAt).getTime() : null
  const secondsUntilRelease = releaseMs ? Math.max(0, Math.floor((releaseMs - now) / 1000)) : null
  const isReleased = releaseMs ? now >= releaseMs : false

  const stages = ICELAND_STAGES_STATIC.map(s => ({
    ...s,
    releaseAt,
    secondsUntilRelease,
    status: (statuses[s.stageNumber]
      ? statuses[s.stageNumber]
      : isReleased ? 'available' : 'locked') as 'locked' | 'available' | 'booked',
  }))

  return {
    stages,
    summary: {
      total: stages.length,
      available: stages.filter(s => s.status === 'available').length,
      booked: stages.filter(s => s.status === 'booked').length,
      locked: stages.filter(s => s.status === 'locked').length,
    },
  }
}

// ── Countdown hook ────────────────────────────────────────────────────────────

function useCountdown(secondsUntilRelease: number | null) {
  const [remaining, setRemaining] = useState(Math.max(0, secondsUntilRelease ?? 0));

  useEffect(() => {
    if (!secondsUntilRelease || secondsUntilRelease <= 0) { setRemaining(0); return; }
    setRemaining(secondsUntilRelease);
    const interval = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(interval);
  }, [secondsUntilRelease]);

  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return {
    remaining,
    isOpen: remaining <= 0,
    formatted: remaining <= 0 ? 'Open now'
      : d > 0 ? `${d}d ${h}h ${m}m`
      : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,
  };
}

// ── Map component ─────────────────────────────────────────────────────────────

function IcelandMap({ stages }: { stages: IcelandStage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ map: any; L: any; layers: any[] } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      const map = L.map(containerRef.current!, { center: [65.0, -18.5], zoom: 6, scrollWheelZoom: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © Carto', maxZoom: 19,
      }).addTo(map);
      mapRef.current = { map, L, layers: [] };
    });
    return () => { mapRef.current?.map?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const { map, L, layers } = mapRef.current;
    layers.forEach((l: any) => l.remove());
    mapRef.current.layers = [];

    const colors = { available: '#032D47', booked: '#888', locked: '#B44C36' };

    stages.forEach(stage => {
      if (!stage.startCoord) return;
      const color = colors[stage.status] ?? colors.locked;
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};color:white;display:flex;align-items:center;justify-content:center;font-size:9px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3);font-family:Georgia,serif">${stage.displayNumber}</div>`,
        iconSize: [24, 24], iconAnchor: [12, 12],
      });
      const marker = L.marker([stage.startCoord.lat, stage.startCoord.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:Georgia,serif;min-width:140px"><p style="font-size:10px;color:#B44C36;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px">Stage ${stage.displayNumber}</p><p style="font-size:13px;color:#032D47;margin:0 0 4px">${stage.startLocation} → ${stage.endLocation}</p><p style="font-size:11px;color:#888;margin:0;text-transform:capitalize">${stage.status}</p></div>`);

      if (stage.endCoord) {
        L.polyline([[stage.startCoord.lat, stage.startCoord.lng], [stage.endCoord.lat, stage.endCoord.lng]], {
          color, weight: 2, opacity: stage.status === 'booked' ? 0.25 : 0.65,
        }).addTo(map);
      }
      mapRef.current!.layers.push(marker);
    });
  }, [stages]);

  return <div ref={containerRef} style={{ height: 440, width: '100%' }} className="border border-border" />;
}

// ── Stage row ─────────────────────────────────────────────────────────────────

interface TeamMember { name: string; email: string }

function StageRow({ stage }: { stage: IcelandStage }) {
  const [expanded, setExpanded] = useState(false);
  const countdown = useCountdown(stage.secondsUntilRelease);
  const isOpen = stage.status === 'available' || countdown.isOpen;

  // Team form state
  const [teamSize, setTeamSize] = useState<1 | 2 | 3>(1);
  const [members, setMembers] = useState<TeamMember[]>([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  const updateMember = (i: number, field: keyof TeamMember, value: string) => {
    setMembers(m => m.map((mem, idx) => idx === i ? { ...mem, [field]: value } : mem));
  };

  const PRICES: Record<number, number> = { 1: 699, 2: 999, 3: 1299 };
  const TIERS: Record<number, string> = { 1: 'stage_solo', 2: 'stage_duo', 3: 'stage_group' };
  const price = PRICES[teamSize];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    const activeMembers = members.slice(0, teamSize);
    const primary = activeMembers[0];
    try {
      // Pass all team member details as metadata to Stripe
      const res = await checkout.event({
        eventId: 'iceland',
        customerEmail: primary.email,
        customerName: primary.name,
        // Extra metadata passed through
        stageNumber: stage.stageNumber,
        tier: TIERS[teamSize],
        teamMembers: activeMembers,
      } as any);
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        setError(res.error ?? 'Something went wrong. Please try again.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await waitlist.joinStage(stage.displayNumber, members[0].email, members[0].name);
      setWaitlistDone(true);
    } catch { setError('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await waitlist.joinIceland(members[0].email, members[0].name);
      setDone(true);
    } catch { setError('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  const statusLabel = stage.status === 'booked' ? 'Registered'
    : isOpen ? 'Available'
    : countdown.formatted;

  const statusStyle = stage.status === 'booked'
    ? 'text-muted-foreground bg-secondary'
    : isOpen
    ? 'text-white bg-accent'
    : 'text-muted-foreground bg-secondary font-mono';

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        className="w-full text-left py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors px-2"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="text-sm text-muted-foreground tabular-nums w-8 shrink-0 font-mono">
          {String(stage.displayNumber).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">
            {stage.startLocation} <span className="text-muted-foreground">→</span> {stage.endLocation}
          </p>
          <div className="flex gap-3 mt-0.5">
            {stage.runDate && (
              <span className="text-xs text-muted-foreground">
                {new Date(stage.runDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {stage.startTime && <span className="text-xs text-muted-foreground">{stage.startTime} local</span>}
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-3 py-1 shrink-0 ${statusStyle}`}>
          {statusLabel}
        </span>
      </button>

      {expanded && (
        <div className="px-2 pb-8 pt-2">
          {stage.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">{stage.description}</p>
          )}

          {/* Available — full registration form */}
          {isOpen && !done && (
            <form onSubmit={handleRegister} className="max-w-md space-y-6">

              {/* Team size selector */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Team size</p>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTeamSize(n)}
                      className={`flex-1 py-2 text-sm border transition-colors ${
                        teamSize === n
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground hover:border-foreground/50'
                      }`}
                    >
                      {n === 1 ? 'Solo' : n === 2 ? 'Duo' : 'Team'}<br />
                      <span className="text-xs opacity-70">€{PRICES[n]}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Price per team — includes 3 books, crew, photographer, food.
                </p>
              </div>

              {/* Team member fields */}
              <div className="space-y-4">
                {Array.from({ length: teamSize }).map((_, i) => (
                  <div key={i}>
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                      {i === 0 ? 'Primary contact' : `Runner ${i + 1}`}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full name"
                        required
                        value={members[i].name}
                        onChange={e => updateMember(i, 'name', e.target.value)}
                        className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={members[i].email}
                        onChange={e => updateMember(i, 'email', e.target.value)}
                        className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent text-white text-sm px-8 py-3 hover:opacity-80 transition-opacity disabled:opacity-50 w-full"
                >
                  {submitting ? 'Reserving…' : `Register Stage ${stage.displayNumber} — €${price}`}
                </button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  You'll be redirected to Stripe. Stage is reserved once payment completes.
                </p>
              </div>
            </form>
          )}

          {/* Booked — waitlist */}
          {stage.status === 'booked' && (
            waitlistDone
              ? <p className="text-sm text-foreground">You're on the waitlist for Stage {stage.displayNumber}.</p>
              : <form onSubmit={handleWaitlist} className="max-w-md space-y-3">
                  <p className="text-sm text-muted-foreground">This stage is taken. Join the waitlist — we'll contact you if it opens up.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Your name" value={members[0].name}
                      onChange={e => updateMember(0, 'name', e.target.value)}
                      className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none" />
                    <input type="email" placeholder="Email" required value={members[0].email}
                      onChange={e => updateMember(0, 'email', e.target.value)}
                      className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={submitting}
                    className="bg-secondary text-foreground text-sm px-6 py-2 hover:bg-secondary/70 transition-colors disabled:opacity-50">
                    {submitting ? '…' : 'Join waitlist'}
                  </button>
                </form>
          )}

          {/* Locked — notify */}
          {stage.status === 'locked' && !countdown.isOpen && (
            done
              ? <p className="text-sm text-foreground">We'll notify you when Iceland opens.</p>
              : <form onSubmit={handleNotify} className="max-w-md space-y-3">
                  <p className="text-sm text-muted-foreground">Get notified the moment registration opens.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Your name" value={members[0].name}
                      onChange={e => updateMember(0, 'name', e.target.value)}
                      className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none" />
                    <input type="email" placeholder="Email" required value={members[0].email}
                      onChange={e => updateMember(0, 'email', e.target.value)}
                      className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={submitting}
                    className="bg-secondary text-foreground text-sm px-6 py-2 hover:bg-secondary/70 transition-colors disabled:opacity-50">
                    {submitting ? '…' : 'Notify me'}
                  </button>
                </form>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const Iceland = () => {
  const { data: settings } = useSiteSettings();
  const releaseAt = settings?.icelandReleaseAt ?? '2026-05-27T18:00:00.000Z';
  const [statuses, setStatuses] = useState<Record<number, 'locked' | 'available' | 'booked'>>({});
  const [waitlistCount, setWaitlistCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Static data shows immediately — no loading state needed
  const { stages, summary } = buildStages(statuses, releaseAt);

  // Fetch live statuses in background via Supabase proxy
  useEffect(() => {
    let cancelled = false;
    fetchLiveStatuses().then(s => { if (!cancelled) setStatuses(s); });
    waitlist.icelandCount().then(wl => { if (!cancelled) setWaitlistCount(wl.count); }).catch(() => {});
    const interval = setInterval(() => {
      fetchLiveStatuses().then(s => { if (!cancelled) setStatuses(s); });
    }, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <>
      <SEO
        title="Iceland 2027"
        description="46 stages. 4,600km. A continuous relay around Iceland's entire coastline. June 12 – July 13, 2027."
        path="/iceland"
      />
      <Navigation />
      <main className="min-h-screen bg-background pt-28 pb-24">
        {/* Header */}
        <div className="px-page max-w-content mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-label mb-element">
              <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />
              Iceland 2027
            </p>
            <h1 className="text-4xl md:text-5xl tracking-tight mb-6 max-w-2xl">
              46 stages.<br />4,600&thinsp;km.<br />One relay around Iceland.
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mb-8">
              Each stage runs continuously. The moment one runner finishes, the next begins.
              Stage registration is €1,399 per team, including three books.
              June 12 – July 13, 2027.
            </p>
            <div className="flex gap-10 py-8 border-t border-border">
              <div>
                <p className="text-3xl tracking-tight">{summary.available}</p>
                <p className="text-caption text-muted-foreground mt-1">Available</p>
              </div>
              <div>
                <p className="text-3xl tracking-tight">{summary.booked}</p>
                <p className="text-caption text-muted-foreground mt-1">Registered</p>
              </div>
              <div>
                <p className="text-3xl tracking-tight">{summary.total}</p>
                <p className="text-caption text-muted-foreground mt-1">Total stages</p>
              </div>
              {waitlistCount > 0 && (
                <div>
                  <p className="text-3xl tracking-tight">{waitlistCount}</p>
                  <p className="text-caption text-muted-foreground mt-1">On waitlist</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="px-page max-w-content mx-auto mb-16">
          <IcelandMap stages={stages} />
        </div>

        <div ref={ref} className="px-page max-w-content mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="border-t border-border">
              {stages.map(stage => (
                <StageRow key={stage.id} stage={stage} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Iceland;
