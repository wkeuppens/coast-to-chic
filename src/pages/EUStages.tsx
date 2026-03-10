import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import wavesLogo from '@/assets/waves-logo.png';
import { SEO } from '@/components/SEO';

const EUStages = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO title="EU Stages" description="Italy to Greece. The main line. Registration coming soon." path="/eu-stages" />
      {/* Header */}
      <header className="px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={wavesLogo} alt="" className="h-8 w-auto" />
          <span className="text-[10px] font-medium uppercase tracking-wider leading-tight">
            <span className="block">Follow</span>
            <span className="block">The</span>
            <span className="block">Coast</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <p className="text-sm text-muted-foreground tracking-wide mb-4">EU Stages</p>
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
            Coming Soon
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Italy to Greece. The main line. Registration details will be available here when stages open.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="border-b border-foreground/30 pb-1">Back to home</span>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default EUStages;
