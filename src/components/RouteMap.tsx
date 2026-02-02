import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [pathData, setPathData] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the SVG and extract path data
    fetch('/route-map.svg')
      .then(res => res.text())
      .then(svgText => {
        // Parse SVG and extract path d attributes
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');
        const pathDatas: string[] = [];
        
        paths.forEach(path => {
          const d = path.getAttribute('d');
          if (d) {
            // Filter out vectorizer watermark paths (typically small or positioned in corners)
            // Watermarks are usually small paths - keep only longer paths (the main route)
            if (d.length > 200) {
              pathDatas.push(d);
            }
          }
        });
        
        setPathData(pathDatas);
      })
      .catch(err => console.error('Failed to load route SVG:', err));
  }, []);

  // Calculate total animation duration based on number of paths
  const totalDuration = 4;
  const pathDuration = pathData.length > 0 ? totalDuration / pathData.length : totalDuration;

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1652 1190"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {pathData.map((d, index) => (
          <motion.path
            key={index}
            d={d}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              duration: pathDuration,
              ease: "easeInOut",
              delay: 0.3 + (index * pathDuration * 0.8)
            }}
          />
        ))}
        
        {/* Starting point marker */}
        <motion.circle
          cx="780"
          cy="59"
          r="8"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
        
        {/* End point marker - appears after animation */}
        <motion.circle
          cx="1510"
          cy="858"
          r="10"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: totalDuration + 0.5, ease: "easeOut" }}
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
            delay: totalDuration + 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </svg>
    </div>
  );
};
