import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, forwardRef } from 'react';
import { smoothPath } from '@/lib/pathSmoothing';
import { fetchAndParseSVG } from '@/lib/svgCache';

// Approximate positions along the path (0 = start, 1 = end)
const KNOKKE_POSITION = 0.0; // Very start of the path
const VENICE_POSITION = 0.88; // Roughly where Venice sits on the coastline

interface MapPinProps {
  label: string;
  pathProgress: number;
  triggerAt: number;
  pathRef: SVGPathElement | null;
  offsetY?: number;
  showConnector?: boolean;
}

const RoutePin = forwardRef<SVGGElement, MapPinProps>(function RoutePin({ label, pathProgress, triggerAt, pathRef, offsetY = -20, showConnector = false }, ref) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isVisible = pathProgress >= triggerAt;

  useEffect(() => {
    if (!pathRef) return;
    const totalLength = pathRef.getTotalLength();
    const point = pathRef.getPointAtLength(totalLength * triggerAt);
    setPosition({ x: point.x, y: point.y });
  }, [pathRef, triggerAt]);

  if (!position) return null;

  const labelY = position.y + offsetY;

  return (
    <g>
      {/* Pin dot */}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r="10"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--background))"
        strokeWidth="3"
        initial={{ scale: 0, opacity: 0 }}
        animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "backOut" }}
      />
      {/* Pulse ring */}
      {isVisible && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r="10"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
      {/* Connector line */}
      {showConnector && (
        <motion.line
          x1={position.x}
          y1={position.y - 13}
          x2={position.x}
          y2={labelY + 6}
          stroke="hsl(var(--accent))"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      )}
      {/* Label background for readability */}
      <motion.rect
        x={position.x - 55}
        y={labelY - 12}
        width="110"
        height="18"
        rx="3"
        fill="hsl(var(--background))"
        fillOpacity="0.85"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      />
      {/* Label */}
      <motion.text
        x={position.x}
        y={labelY}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="14"
        fontFamily="var(--font-body)"
        fontWeight="400"
        letterSpacing="0.06em"
        initial={{ opacity: 0, y: 5 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {label}
      </motion.text>
    </g>
  );
};

export const RouteMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 600");
  const [pathRef, setPathRef] = useState<SVGPathElement | null>(null);
  const [pathProgress, setPathProgress] = useState(0);

  useEffect(() => {
    fetchAndParseSVG('/route-map.svg', (d) => smoothPath(d, 3, 1.2, false))
      .then(result => {
        if (result) {
          setPathData(result.pathData);
          setViewBox(result.viewBox);
        }
      });
  }, []);

  // Track animation progress
  useEffect(() => {
    if (!isInView) return;
    const duration = 4000; // matches the 4s animation
    const delay = 300;
    const start = performance.now() + delay;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      // easeInOut approximation
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setPathProgress(eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView]);

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {pathData && (
          <>
            <motion.path
              ref={(el) => setPathRef(el)}
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
            <MapPin
              label="KNOKKE"
              pathProgress={pathProgress}
              triggerAt={KNOKKE_POSITION}
              pathRef={pathRef}
            />
            <MapPin
              label="WE ARE HERE"
              pathProgress={pathProgress}
              triggerAt={VENICE_POSITION}
              pathRef={pathRef}
              offsetY={-45}
              showConnector
            />
          </>
        )}
      </svg>
    </div>
  );
};
