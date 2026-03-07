import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { EditorialArrow } from './EditorialArrow';

export const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState('');

  return (
    <section id="newsletter" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-secondary">
      <div ref={ref} className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-caption text-muted-foreground mb-4">
            Updates
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            New stages. Books. Routes.
          </h2>
          <p className="text-muted-foreground mb-12 leading-relaxed">
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
              className="flex-1 bg-background border border-border px-5 py-4 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full font-display font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe
              <EditorialArrow size={14} className="invert" />
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-8">
            By subscribing, you agree to the privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
