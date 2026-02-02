import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 600");

  useEffect(() => {
    fetch('/route-map.svg')
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        
        // Get viewBox from the SVG
        const svg = doc.querySelector('svg');
        if (svg) {
          const vb = svg.getAttribute('viewBox');
          if (vb) setViewBox(vb);
        }
        
        // Get the path element
        const path = doc.querySelector('path');
        if (path) {
          const d = path.getAttribute('d');
          if (d) setPathData(d);
        }
      })
      .catch(err => console.error('Failed to load route SVG:', err));
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
            strokeWidth="2"
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