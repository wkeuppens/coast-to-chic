import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // SVG path exactly matching the European coastline from the reference image
  // Belgium → France Atlantic → Spain/Portugal → Mediterranean → Italy
  const coastlinePath = `
    M 195 28
    C 200 30, 210 25, 220 30
    C 235 38, 250 32, 265 40
    C 275 45, 280 42, 290 48
    L 295 52
    C 285 58, 275 65, 265 75
    C 255 85, 248 95, 242 108
    C 238 118, 230 130, 225 145
    C 218 162, 210 175, 205 188
    C 198 205, 188 218, 178 230
    C 165 248, 155 262, 148 278
    C 142 292, 138 305, 135 318
    C 130 335, 122 352, 115 368
    C 108 382, 98 395, 88 408
    C 78 422, 68 438, 60 455
    C 52 472, 45 490, 42 508
    C 38 528, 35 548, 38 568
    C 42 588, 52 605, 65 618
    C 78 632, 95 642, 108 655
    C 118 665, 125 678, 128 692
    C 132 708, 128 725, 118 738
    C 108 752, 92 762, 78 772
    C 65 782, 55 795, 52 812
    C 48 828, 52 845, 62 858
    C 72 872, 88 882, 105 888
    C 125 895, 148 898, 170 895
    C 192 892, 215 885, 235 875
    C 258 862, 280 848, 302 835
    C 325 822, 350 812, 375 808
    C 400 805, 425 808, 448 818
    C 465 825, 478 838, 488 852
    C 495 862, 498 875, 495 888
    C 492 900, 485 912, 475 922
    C 465 932, 452 940, 438 948
    C 428 955, 420 965, 418 978
    C 416 992, 422 1005, 432 1015
    C 442 1025, 458 1032, 475 1035
    C 495 1038, 518 1035, 538 1028
    C 558 1020, 575 1008, 588 992
    C 598 978, 605 962, 608 945
    C 612 925, 610 905, 602 888
    C 595 872, 582 858, 568 848
    C 555 838, 538 832, 522 828
    C 505 825, 488 825, 472 830
  `;

  // Italy path (separate piece on the right)
  const italyPath = `
    M 620 285
    C 625 295, 635 302, 648 305
    C 662 308, 678 305, 690 298
    C 702 290, 712 278, 718 265
    C 722 252, 720 238, 712 228
    C 705 218, 692 212, 678 215
    C 665 218, 652 228, 645 242
    C 640 255, 642 270, 650 282
    C 658 295, 672 305, 688 312
    C 705 320, 725 322, 742 318
    C 758 315, 772 305, 782 292
    C 792 278, 798 262, 795 245
    C 792 228, 782 212, 768 202
    C 755 192, 738 188, 722 192
    C 705 195, 690 205, 680 220
    C 672 235, 668 252, 672 270
    C 675 288, 685 305, 700 318
    C 715 332, 735 342, 755 345
    C 768 348, 778 355, 785 368
    C 792 382, 795 398, 792 415
    C 788 432, 778 448, 765 462
    C 752 475, 735 485, 718 492
    C 702 498, 685 502, 668 498
    C 652 495, 638 485, 628 472
    C 618 458, 612 442, 615 425
    C 618 408, 628 392, 642 382
    C 655 372, 672 368, 688 372
    C 702 375, 715 385, 722 398
    C 728 412, 728 428, 722 442
    C 715 458, 702 472, 685 482
    C 668 492, 648 498, 628 502
    C 612 505, 598 512, 588 525
    C 578 538, 575 555, 580 572
    C 585 588, 598 602, 615 608
  `;

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 800 1100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* Main coastline path - Belgium to Mediterranean */}
        <motion.path
          d={coastlinePath}
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
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
        
        {/* Italy coastline */}
        <motion.path
          d={italyPath}
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            delay: 3.5
          }}
        />
        
        {/* Starting point marker - Belgium */}
        <motion.circle
          cx="195"
          cy="28"
          r="4"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        
        {/* Current position marker - Italy */}
        <motion.circle
          cx="615"
          cy="608"
          r="5"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 6, ease: "easeOut" }}
        />
        
        {/* Pulsing effect on current position */}
        <motion.circle
          cx="615"
          cy="608"
          r="5"
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
            delay: 6.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </svg>
    </div>
  );
};
