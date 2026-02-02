import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Precise centerline traced from the vectorized reference image
  // Route: Belgium → France Atlantic coast → Spain/Portugal tip → Mediterranean → Italy
  const routePath = `
    M 780 59
    C 775 62, 770 68, 762 78
    C 752 92, 742 108, 730 125
    C 718 142, 705 162, 692 182
    C 678 205, 665 228, 655 252
    C 645 278, 638 305, 628 332
    C 618 360, 605 388, 588 412
    C 570 438, 548 460, 522 478
    C 496 496, 466 510, 432 518
    C 398 526, 360 528, 325 522
    C 290 516, 258 502, 235 480
    C 212 458, 198 428, 195 398
    C 192 368, 200 338, 218 315
    C 236 292, 262 278, 290 275
    C 318 272, 348 282, 368 302
    C 388 322, 398 352, 395 382
    C 392 412, 378 442, 355 468
    C 332 495, 300 518, 268 542
    C 235 568, 202 595, 175 625
    C 148 658, 128 695, 120 735
    C 112 778, 118 822, 140 862
    C 162 902, 200 935, 248 958
    C 298 982, 358 995, 420 998
    C 482 1002, 548 995, 610 982
    C 672 968, 732 948, 788 920
    C 845 892, 898 858, 945 820
    C 992 782, 1035 740, 1072 698
    C 1108 655, 1140 612, 1168 572
    C 1195 532, 1220 495, 1248 465
    C 1278 435, 1312 412, 1350 402
    C 1388 392, 1430 395, 1468 415
    C 1505 435, 1538 472, 1555 520
    C 1572 568, 1575 628, 1565 688
    C 1555 748, 1532 808, 1510 858
  `;

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1652 1190"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* Main route line - draws from Belgium to Italy */}
        <motion.path
          d={routePath}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        
        {/* Starting point marker - Belgium */}
        <motion.circle
          cx="780"
          cy="59"
          r="8"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
        
        {/* End point marker - Italy */}
        <motion.circle
          cx="1510"
          cy="858"
          r="10"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 4.3, ease: "easeOut" }}
        />
        
        {/* Pulsing effect on end position */}
        <motion.circle
          cx="1510"
          cy="858"
          r="10"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 1 }}
          animate={isInView ? { 
            opacity: [0, 0.6, 0],
            scale: [1, 2.5, 3]
          } : {}}
          transition={{ 
            duration: 2,
            delay: 4.8,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </svg>
    </div>
  );
};
