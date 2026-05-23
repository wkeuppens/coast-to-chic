import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RouteMap } from '@/components/RouteMap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading');

  useEffect(() => {
    // Simulate loading progress
    const duration = 2500;
    const interval = 20;
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment + Math.random() * 1.5;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      setTimeout(() => setPhase('revealing'), 400);
    }
  }, [progress, phase]);

  useEffect(() => {
    if (phase === 'revealing') {
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 1000);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Route map as loading indicator */}
          <motion.div
            className="relative w-64 h-48 md:w-80 md:h-60 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <RouteMap />
          </motion.div>

          {/* Logo/Brand mark */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h1 
              className="text-3xl md:text-5xl font-display font-bold tracking-tighter uppercase"
              animate={phase === 'revealing' ? { y: -20, opacity: 0 } : {}}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                FOLLOW
              </motion.span>
              <motion.span
                className="inline-block ml-3 text-muted-foreground"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                THE
              </motion.span>
              <motion.span
                className="inline-block ml-3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                COAST
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Progress text */}
          <motion.div
            className="font-mono text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.span
              animate={phase === 'revealing' ? { opacity: 0 } : {}}
            >
              {Math.round(progress)}%
            </motion.span>
          </motion.div>

          {/* Reveal curtains */}
          <motion.div
            className="absolute inset-0 flex"
            initial={{ opacity: 0 }}
            animate={phase === 'revealing' ? { opacity: 1 } : {}}
          >
            <motion.div
              className="w-1/2 h-full bg-background"
              initial={{ x: 0 }}
              animate={phase === 'revealing' ? { x: '-100%' } : {}}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="w-1/2 h-full bg-background"
              initial={{ x: 0 }}
              animate={phase === 'revealing' ? { x: '100%' } : {}}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
