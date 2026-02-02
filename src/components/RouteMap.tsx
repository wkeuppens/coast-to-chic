import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // SVG path tracing the Western European coastline from Belgium to Southern Europe
  // This traces: Belgium → France (Atlantic coast) → Spain → Portugal → back to Spain → continuing south
  const coastlinePath = `
    M 45 5
    L 42 15
    L 38 25
    L 35 40
    L 30 55
    L 25 70
    L 22 85
    L 20 100
    L 18 115
    L 15 130
    L 12 145
    L 10 160
    L 8 175
    L 6 190
    L 5 205
    L 4 220
    L 3 235
    L 2 250
    L 3 265
    L 5 280
    L 8 295
    L 12 310
    L 18 325
    L 25 340
    L 20 355
    L 15 370
    L 12 385
    L 10 400
    L 8 415
    L 6 430
    L 5 445
    L 6 460
    L 8 475
    L 12 490
    L 18 505
    L 25 520
    L 32 535
    L 38 550
    L 42 565
    L 45 580
    L 48 595
    L 50 610
    L 52 625
    L 55 640
    L 58 655
    L 62 670
    L 68 685
    L 75 700
    L 82 715
    L 88 730
    L 92 745
    L 95 760
    L 97 775
    L 98 790
    L 97 805
    L 95 820
    L 92 835
    L 88 850
    L 85 865
    L 82 880
    L 80 895
    L 78 910
    L 77 925
  `;

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 100 930"
        className="w-full h-full max-h-[400px]"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* Animated coastline path */}
        <motion.path
          d={coastlinePath}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Starting point marker - Belgium */}
        <motion.circle
          cx="45"
          cy="5"
          r="3"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
        
        {/* Current position marker - animated to appear at end */}
        <motion.circle
          cx="77"
          cy="925"
          r="4"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 3.5, ease: "easeOut" }}
        />
        
        {/* Pulsing effect on current position */}
        <motion.circle
          cx="77"
          cy="925"
          r="4"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          initial={{ opacity: 0, scale: 1 }}
          animate={isInView ? { 
            opacity: [0, 0.6, 0],
            scale: [1, 2.5, 3]
          } : {}}
          transition={{ 
            duration: 2,
            delay: 4,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </svg>
    </div>
  );
};
