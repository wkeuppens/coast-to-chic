import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { newsletter } from '@/lib/api';

/**
 * Newsletter — editorial. Simple input, no decoration.
 * Like a subscription card tucked into the back of a book.
 */
export const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      await newsletter.subscribe(email);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="newsletter" className="py-chapter px-page">
      <div ref={ref} className="max-w-text mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-label mb-element">
            <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />
            Updates
          </p>
          <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
            New stages. Books. Routes.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-text">
            A few emails per year. When there's something to say.
          </p>

          {status === 'done' ? (
            <p className="text-sm text-foreground">You're on the list.</p>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3"
              aria-label="Newsletter signup"
              onSubmit={handleSubmit}
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={status === 'loading'}
                className="flex-1 bg-transparent border-b border-foreground/20 px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-accent text-white text-caption px-6 py-3 rounded-full hover:opacity-80 transition-opacity whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-xs text-red-500 mt-2">Something went wrong. Please try again.</p>
          )}

          <p className="text-[10px] text-muted-foreground mt-6">
            By subscribing you agree to our privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
