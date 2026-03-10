import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

/**
 * Newsletter — editorial. Simple input, no decoration.
 * Like a subscription card tucked into the back of a book.
 */
export const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [email, setEmail] = useState('');

  return (
    <section id="newsletter" className="py-chapter px-page">
      <div ref={ref} className="max-w-text mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <hr className="rule mb-8" />
          <p className="text-label mb-element"><span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />Updates</p>
          <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
            New stages. Books. Routes.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-text">
            A few emails per year. When there's something to say.
          </p>

          <form className="flex flex-col sm:flex-row gap-3" aria-label="Newsletter signup">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="flex-1 bg-transparent border-b border-foreground/20 px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              className="text-caption text-foreground bg-transparent border-b border-foreground px-0 py-3 hover:opacity-50 transition-opacity whitespace-nowrap"
            >
              Subscribe →
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground mt-6">
            By subscribing you agree to our privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
