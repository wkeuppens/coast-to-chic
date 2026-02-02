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
          <p className="text-sm text-white/50 tracking-wide mb-4">
            Stay informed
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
            Stage releases. Book launches. Updates.
          </h2>
          <p className="text-white/60 mb-10">
            New stages are released a few times per year and fill quickly. 
            Subscribe to be notified.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 bg-transparent border border-white/20 px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-8 py-4 font-display font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>

          <p className="text-xs text-white/30 mt-6">
            By subscribing, you agree to the privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
