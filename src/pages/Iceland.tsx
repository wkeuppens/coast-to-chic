import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { MagneticButton } from '@/components/MagneticButton';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { iceland, waitlist, checkout, type IcelandStage } from '@/lib/api';

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

function StageRow({ stage }: { stage: IcelandStage }) {
  const [expanded, setExpanded] = useState(false);
  const countdown = useCountdown(stage.secondsUntilRelease);
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  const statusLabel = stage.status === 'booked' ? 'Registered'
    : (stage.status === 'available' || countdown.isOpen) ? 'Available'
    : countdown.formatted;

  const statusStyle = stage.status === 'booked'
    ? 'text-muted-foreground bg-secondary'
    : (stage.status === 'available' || countdown.isOpen)
    ? 'text-accent-foreground bg-accent'
    : 'text-muted-foreground bg-secondary font-mono';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await checkout.event({ eventId: 'iceland', customerEmail: form.email, customerName: form.name });
      if (res.paymentUrl) { window.location.href = res.paymentUrl; }
      else setError(res.error ?? 'Something went wrong.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await waitlist.joinStage(stage.displayNumber, form.email, form.name);
      setWaitlistDone(true);
    } catch { setError('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await waitlist.joinIceland(form.email, form.name);
      setDone(true);
    } catch { setError('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

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
            {stage.runDate && <span className="text-xs text-muted-foreground">{new Date(stage.runDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
            {stage.startTime && <span className="text-xs text-muted-foreground">{stage.startTime.slice(0, 5)} local</span>}
            {stage.distanceKm && <span className="text-xs text-muted-foreground">~{stage.distanceKm}km</span>}
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-3 py-1 shrink-0 ${statusStyle}`}>
          {statusLabel}
        </span>
      </button>

      {expanded && (
        <div className="px-2 pb-6 pt-2">
          {stage.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-lg">{stage.description}</p>
          )}

          {/* Register */}
          {(stage.status === 'available' || countdown.isOpen) && !done && (
            <form onSubmit={handleRegister} className="flex flex-col gap-3 max-w-sm">
              <p className="text-sm text-foreground">€1,399 per team — includes 3 books</p>
              <input type="text" placeholder="Your name" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
              <input type="email" placeholder="Email address" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button type="submit" disabled={submitting}
                className="bg-accent text-white text-sm px-6 py-2.5 hover:opacity-80 transition-opacity disabled:opacity-50 self-start">
                {submitting ? 'Processing…' : 'Register — €1,399'}
              </button>
            </form>
          )}

          {/* Booked: waitlist */}
          {stage.status === 'booked' && (
            waitlistDone
              ? <p className="text-sm text-foreground">You're on the waitlist.</p>
              : <form onSubmit={handleWaitlist} className="flex flex-col gap-3 max-w-sm">
                  <p className="text-xs text-muted-foreground">Join waitlist for Stage {stage.displayNumber}</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="border border-border bg-transparent px-3 py-2 text-sm flex-1 focus:outline-none" />
                    <input type="email" placeholder="Email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="border border-border bg-transparent px-3 py-2 text-sm flex-1 focus:outline-none" />
                    <button type="submit" disabled={submitting}
                      className="bg-secondary text-foreground text-sm px-4 py-2 hover:bg-secondary/70 transition-colors disabled:opacity-50 whitespace-nowrap">
                      {submitting ? '…' : 'Join'}
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </form>
          )}

          {/* Locked: notify */}
          {stage.status === 'locked' && !countdown.isOpen && (
            done
              ? <p className="text-sm text-foreground">You're on the list — we'll notify you when this opens.</p>
              : <form onSubmit={handleNotify} className="flex flex-col gap-3 max-w-sm">
                  <p className="text-xs text-muted-foreground">Notify me when Iceland opens</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="border border-border bg-transparent px-3 py-2 text-sm flex-1 focus:outline-none" />
                    <input type="email" placeholder="Email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="border border-border bg-transparent px-3 py-2 text-sm flex-1 focus:outline-none" />
                    <button type="submit" disabled={submitting}
                      className="bg-secondary text-foreground text-sm px-4 py-2 hover:bg-secondary/70 transition-colors disabled:opacity-50 whitespace-nowrap">
                      {submitting ? '…' : 'Notify me'}
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </form>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const Iceland = () => {
  const [data, setData] = useState<{ stages: IcelandStage[]; summary: any } | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const fetchData = useCallback(async () => {
    try {
      const [result, wl] = await Promise.all([
        iceland.stages(),
        waitlist.icelandCount().catch(() => ({ count: 0 })),
      ]);
      setData(result);
      setWaitlistCount(wl.count);
    } catch { /* keep last known data */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

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

            {!loading && data && (
              <div className="flex gap-10 py-8 border-t border-border">
                <div>
                  <p className="text-3xl tracking-tight">{data.summary.available}</p>
                  <p className="text-caption text-muted-foreground mt-1">Available</p>
                </div>
                <div>
                  <p className="text-3xl tracking-tight">{data.summary.booked}</p>
                  <p className="text-caption text-muted-foreground mt-1">Registered</p>
                </div>
                <div>
                  <p className="text-3xl tracking-tight">{data.summary.total}</p>
                  <p className="text-caption text-muted-foreground mt-1">Total stages</p>
                </div>
                {waitlistCount > 0 && (
                  <div>
                    <p className="text-3xl tracking-tight">{waitlistCount}</p>
                    <p className="text-caption text-muted-foreground mt-1">On waitlist</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Map */}
        {data && (
          <div className="px-page max-w-content mx-auto mb-16">
            <IcelandMap stages={data.stages} />
          </div>
        )}

        {/* Stage list */}
        <div ref={ref} className="px-page max-w-content mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="border-t border-border">
              {loading && (
                <div className="py-16 text-center text-sm text-muted-foreground">Loading stages…</div>
              )}
              {data?.stages.map(stage => (
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
