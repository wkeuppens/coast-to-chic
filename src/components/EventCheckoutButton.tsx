/**
 * EventCheckoutButton.tsx
 * src/components/EventCheckoutButton.tsx
 *
 * Drop-in replacement for the MagneticButton → /checkout?... pattern.
 * Wraps a button that calls the API and redirects to Stripe.
 *
 * Usage:
 *   <EventCheckoutButton eventId="ftk_35km" price={39} label="Register — €39" />
 *   <EventCheckoutButton eventId="book_launch_free" price={0} label="RSVP — Free" />
 */

import { useState } from 'react';
import { checkout } from '@/lib/api';

type EventId =
  | 'book_launch_dinner' | 'book_launch_free'
  | 'ftk_35km' | 'ftk_75km'
  | 'trg_shared' | 'trg_own'
  | 'madeira'
  | 'tmb_2026_4day' | 'tmb_2027_4day' | 'tmb_2027_7day'
  | 'iceland';

interface Props {
  eventId: EventId;
  price: number;
  label: string;
  addDinner?: boolean;
  className?: string;
}

export function EventCheckoutButton({ eventId, price, label, addDinner, className }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const baseClass = className ?? 'inline-flex items-center justify-center bg-accent text-accent-foreground rounded-full px-6 py-2.5 text-sm tracking-wide hover:opacity-80 transition-opacity';

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={baseClass}>
        {label}
      </button>
    );
  }

  if (done) {
    if (eventId === 'book_launch_free') {
      return <p className="text-sm text-foreground">RSVP confirmed. See you there.</p>;
    }
    return <p className="text-sm text-foreground">Redirecting to payment…</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      if (eventId === 'book_launch_free') {
        await checkout.bookLaunchFree({ customerEmail: form.email, customerName: form.name });
        setDone(true);
        return;
      }
      const res = await checkout.event({
        eventId: eventId as any,
        addDinner,
        customerEmail: form.email,
        customerName: form.name,
      });
      if (res.paymentUrl) { setDone(true); window.location.href = res.paymentUrl; }
      else setError(res.error ?? 'Something went wrong.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xs">
      <input type="text" placeholder="Your name" required value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
      <input type="email" placeholder="Email address" required value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className={baseClass}>
          {submitting ? 'Processing…' : price === 0 ? 'Confirm RSVP' : `Pay €${price}${addDinner ? '+' : ''}`}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
