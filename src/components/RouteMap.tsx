import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import routeMapSvg from '@/assets/route-trace.svg';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center overflow-hidden">
      <motion.img
        src={routeMapSvg}
        alt="European coast route from Belgium to Italy"
        className="w-full h-full object-contain"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.02 }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
          delay: 0.3
        }}
      />
    </div>
  );
};
