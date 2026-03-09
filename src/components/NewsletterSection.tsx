import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { EditorialArrow } from './EditorialArrow';

export const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState('');

  return (
    <section id="newsletter" className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div ref={ref} className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <hr className="rule mb-12" />
          <p className="text-caption text-muted-foreground mb-4">
            <EditorialArrow size={12} className="mr-2 opacity-40" />
            Updates
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            New stages. Books. Routes.
          </h2>
          <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
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
              className="flex-1 bg-background border border-foreground px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 font-display text-xs uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              <EditorialArrow size={12} className="invert" />
              Subscribe
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground mt-6 tracking-wide">
            By subscribing, you agree to the privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
