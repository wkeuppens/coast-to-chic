import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { smoothPath } from '@/lib/pathSmoothing';
import { fetchAndParseSVG } from '@/lib/svgCache';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading');
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 600");

  // Load the route SVG path (cached, shared with RouteMap)
  useEffect(() => {
    fetchAndParseSVG('/route-map.svg', (d) => smoothPath(d, 3, 1.2, false))
      .then(result => {
        if (result) {
          setPathData(result.pathData);
          setViewBox(result.viewBox);
        }
      });
  }, []);

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
          {/* Route map trace as loading indicator */}
          <motion.div
            className="relative w-64 h-48 md:w-80 md:h-60 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <svg
              viewBox={viewBox}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
            >
              {/* Background path (faint) */}
              {pathData && (
                <path
                  d={pathData}
                  stroke="hsl(var(--muted-foreground) / 0.15)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {/* Animated progress path */}
              {pathData && (
                <motion.path
                  d={pathData}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              )}
            </svg>
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
