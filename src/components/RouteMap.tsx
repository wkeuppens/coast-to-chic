import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { smoothPath } from '@/lib/pathSmoothing';
import { fetchAndParseSVG } from '@/lib/svgCache';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 600");

  useEffect(() => {
    fetchAndParseSVG('/route-map.svg', (d) => smoothPath(d, 3, 1.2, false))
      .then(result => {
        if (result) {
          setPathData(result.pathData);
          setViewBox(result.viewBox);
        }
      });
  }, []);

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {pathData && (
          <motion.path
            d={pathData}
            stroke="hsl(var(--foreground))"
            strokeWidth="2.5"
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
        )}
      </svg>
    </div>
  );
};