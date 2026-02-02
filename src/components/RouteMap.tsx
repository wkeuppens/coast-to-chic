import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Simplified centerline path extracted from the traced SVG
  // Following the route: Belgium → France coast → Spain/Portugal → Mediterranean → Italy
  const routePath = `
    M 780 60
    C 760 75, 740 90, 720 110
    C 700 130, 680 155, 665 185
    C 650 215, 640 250, 630 290
    C 620 330, 605 370, 585 405
    C 565 440, 540 470, 515 495
    C 490 520, 460 540, 430 555
    C 400 570, 365 580, 330 585
    C 295 590, 260 590, 230 585
    C 200 580, 175 570, 155 555
    C 135 540, 120 520, 115 495
    C 110 470, 115 445, 130 425
    C 145 405, 170 395, 195 395
    C 220 395, 245 410, 260 435
    C 275 460, 280 490, 275 520
    C 270 550, 255 580, 235 610
    C 215 640, 190 670, 165 700
    C 140 730, 120 765, 115 800
    C 110 835, 120 870, 145 900
    C 170 930, 210 950, 255 960
    C 300 970, 350 970, 400 965
    C 450 960, 500 950, 545 940
    C 590 930, 635 920, 675 905
    C 715 890, 750 870, 780 845
    C 810 820, 835 790, 855 760
    C 875 730, 890 700, 910 675
    C 930 650, 955 630, 985 620
    C 1015 610, 1050 610, 1085 620
    C 1120 630, 1155 650, 1185 680
    C 1215 710, 1240 745, 1260 785
    C 1280 825, 1295 870, 1305 920
    C 1315 970, 1320 1020, 1330 1065
  `;

  // Italy branch path
  const italyPath = `
    M 1425 700
    C 1435 720, 1450 745, 1470 775
    C 1490 805, 1515 840, 1520 875
  `;

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1652 1190"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* Main route line - draws from start to end */}
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
        
        {/* Italy branch */}
        <motion.path
          d={italyPath}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            delay: 3.8
          }}
        />
        
        {/* Starting point marker - Belgium */}
        <motion.circle
          cx="780"
          cy="60"
          r="8"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
        
        {/* End point marker - main route */}
        <motion.circle
          cx="1330"
          cy="1065"
          r="10"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 4.3, ease: "easeOut" }}
        />
        
        {/* Pulsing effect on end position */}
        <motion.circle
          cx="1330"
          cy="1065"
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
