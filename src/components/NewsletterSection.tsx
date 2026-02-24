import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState('');

  return (
    <section id="newsletter" className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-foreground text-primary-foreground">
      <div ref={ref} className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm text-inv-muted tracking-wide mb-4">
            Updates
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
            New stages. Books. Routes.
          </h2>
          <p className="text-inv-muted mb-10">
            A few emails per year. When there's something to say.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" aria-label="Newsletter signup">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="flex-1 bg-transparent border border-inv-border px-5 py-4 rounded-full text-inv placeholder:text-inv-subtle focus:outline-none focus:border-inv-muted transition-colors"
            />
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-8 py-4 rounded-full font-display font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>

          <p className="text-xs text-inv-faint mt-6">
            By subscribing, you agree to the privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
