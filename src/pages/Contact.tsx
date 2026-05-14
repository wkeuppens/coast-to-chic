import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { contact } from '@/lib/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await contact.send({ ...form, source: 'contact-page' });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with Follow the Coast." path="/contact" />
      <Navigation />
      <main className="min-h-screen bg-background pt-32 pb-24 px-page">
        <div className="max-w-content mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-label mb-element">
              <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />
              Contact
            </p>
            <h1 className="text-3xl md:text-4xl tracking-tight mb-4">Get in touch.</h1>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Questions about stages, events, or books. We reply within a couple of days.
            </p>
          </motion.div>

          {status === 'done' ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-foreground leading-relaxed"
            >
              Got it. We'll be in touch within a couple of days.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-caption text-muted-foreground block mb-2">Name</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-caption text-muted-foreground block mb-2">Email</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-caption text-muted-foreground block mb-2">Subject (optional)</label>
                <input
                  type="text" value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Stage registration, books, events…"
                />
              </div>

              <div>
                <label className="text-caption text-muted-foreground block mb-2">Message</label>
                <textarea
                  required rows={5} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                  placeholder="Your message…"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-accent text-white text-caption px-8 py-3 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
