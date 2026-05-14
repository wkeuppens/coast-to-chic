import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { checkout, type SessionResponse } from '@/lib/api';

const OrderSuccess = () => {
  const [data, setData] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) { setError('No order reference found.'); setLoading(false); return; }
    checkout.session(sessionId)
      .then(setData)
      .catch(() => setError('Could not load order details. If you completed a payment, check your email for confirmation.'))
      .finally(() => setLoading(false));
  }, []);

  const headline = (() => {
    switch (data?.productType) {
      case 'book':  return 'Your books are on their way.';
      case 'stage': return 'Stage registered.';
      case 'event': return `${data.eventName ?? 'Event'} — confirmed.`;
      case 'print': return 'Print ordered.';
      default:      return 'Order confirmed.';
    }
  })();

  return (
    <>
      <SEO title="Order confirmed" description="Your Follow the Coast order is confirmed." path="/order-success" />
      <Navigation />
      <main className="min-h-screen bg-background flex items-center justify-center px-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-md w-full text-center py-24"
        >
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <>
              <p className="text-sm text-muted-foreground mb-8">{error}</p>
              <Link to="/" className="text-sm text-accent hover:opacity-80 transition-opacity">
                Back to Follow the Coast
              </Link>
            </>
          ) : (
            <>
              <p className="text-label mb-6">
                <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />
                Confirmed
              </p>
              <h1 className="text-3xl md:text-4xl tracking-tight mb-5">{headline}</h1>
              {data?.customerEmail && (
                <p className="text-sm text-muted-foreground mb-2">
                  A confirmation email is on its way to {data.customerEmail}.
                </p>
              )}
              {data?.amountTotal && (
                <p className="text-sm text-muted-foreground mb-10">
                  Total paid: €{(data.amountTotal / 100).toFixed(2)}
                </p>
              )}
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-accent text-white text-sm px-8 py-3 rounded-full hover:opacity-80 transition-opacity"
              >
                Back to Follow the Coast
              </Link>
            </>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default OrderSuccess;
