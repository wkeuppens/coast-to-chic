import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, CreditCard } from 'lucide-react';
import wavesLogo from '@/assets/waves-logo.png';
import { SEO } from '@/components/SEO';

const Checkout = () => {
  const [params] = useSearchParams();
  const product = params.get('product') || 'Registration';
  const variant = params.get('variant') || '';
  const price = params.get('price') || '';
  const returnTo = params.get('return') || '/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO title="Checkout" description="Complete your Follow the Coast registration or order." path="/checkout" />
      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto brightness-0" />
          <span className="font-display text-[10px] font-bold uppercase tracking-wider leading-tight">
            <span className="block">Follow</span>
            <span className="block">The</span>
            <span className="block">Coast</span>
          </span>
        </Link>
        <Link
          to={returnTo}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Order summary */}
          <div className="border border-border rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">{product}</h1>
                {variant && <p className="text-sm text-muted-foreground mt-1">{variant}</p>}
              </div>
            </div>
            {price && (
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl font-bold">{price}</span>
              </div>
            )}
          </div>

          {/* Payment placeholder */}
          <div className="border border-dashed border-border rounded-2xl p-8 text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-4 text-muted-foreground/40" />
            <h2 className="font-display text-lg font-medium mb-2">Payment coming soon</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Online payment will be available here shortly. In the meantime, reach out to{' '}
              <a
                href="mailto:hello@followthecoast.com"
                className="text-accent hover:underline"
              >
                hello@followthecoast.com
              </a>{' '}
              to reserve your spot.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
