import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { smoothPath } from '@/lib/pathSmoothing';
import { fetchAndParseSVG } from '@/lib/svgCache';
import { STAGES } from '@/data/stages';

/**
 * Interactive segmented route map for the Archive.
 * Splits the coastline SVG path into one segment per completed stage.
 * Each segment highlights on hover and links to that stage in the archive.
 */

const COMPLETED_STAGES = STAGES.filter(s => s.status === 'Completed');

function splitPathIntoSegments(
  pathEl: SVGPathElement,
  segmentCount: number
): string[] {
  const total = pathEl.getTotalLength();
  const segLen = total / segmentCount;
  const segments: string[] = [];

  for (let i = 0; i < segmentCount; i++) {
    const start = i * segLen;
    const end = (i + 1) * segLen;
    // Sample points along this segment
    const points: { x: number; y: number }[] = [];
    const steps = Math.max(8, Math.ceil(segLen / 3));
    for (let s = 0; s <= steps; s++) {
      const t = start + (end - start) * (s / steps);
      const pt = pathEl.getPointAtLength(t);
      points.push({ x: pt.x, y: pt.y });
    }
    // Build a polyline "M x,y L x,y L ..."
    const d = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    segments.push(d);
  }

  return segments;
}

const RouteMapPage = () => {
  const navigate = useNavigate();
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState('0 0 800 600');
  const [segments, setSegments] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hiddenPathRef = useRef<SVGPathElement | null>(null);

  // Load SVG path data
  useEffect(() => {
    fetchAndParseSVG('/route-map.svg', (d) => smoothPath(d, 3, 1.2, false))
      .then(result => {
        if (result) {
          setPathData(result.pathData);
          setViewBox(result.viewBox);
        }
      });
  }, []);

  // Once the hidden path renders, split it into segments
  useEffect(() => {
    if (!hiddenPathRef.current || !pathData) return;
    const segs = splitPathIntoSegments(hiddenPathRef.current, COMPLETED_STAGES.length);
    setSegments(segs);
  }, [pathData]);

  const hoveredStage = hoveredIndex !== null ? COMPLETED_STAGES[hoveredIndex] : null;

  const handleClick = useCallback((index: number) => {
    // Navigate to archive — could deep-link to specific stage in future
    navigate('/archive');
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="Route Map | Follow the Coast"
        description="Explore the full coastline route, stage by stage."
        path="/route-map"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <Link
          to="/archive"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-display"
        >
          <ArrowLeft className="w-4 h-4" />
          Archive
        </Link>
        <span className="text-xs uppercase tracking-widest text-muted-foreground/50 font-display">
          Route Map
        </span>
      </header>

      {/* Map container */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-6 md:px-12">
        <div className="w-full max-w-5xl relative">
          {/* Hover tooltip */}
          {hoveredStage && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-card border border-border px-5 py-3 rounded-lg shadow-lg"
            >
              <p className="font-display text-sm uppercase tracking-wider text-accent">
                {hoveredStage.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hoveredStage.location}, {hoveredStage.country} · {hoveredStage.year}
              </p>
              {hoveredStage.shoreholder && (
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  {hoveredStage.shoreholder}
                </p>
              )}
            </motion.div>
          )}

          <svg
            viewBox={viewBox}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            {/* Hidden path for measurement */}
            {pathData && (
              <path
                ref={hiddenPathRef}
                d={pathData}
                stroke="none"
                fill="none"
              />
            )}

            {/* Base ghost path */}
            {pathData && (
              <path
                d={pathData}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                strokeOpacity="0.15"
                fill="none"
              />
            )}

            {/* Interactive segments */}
            {segments.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={hoveredIndex === i ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'}
                strokeWidth={hoveredIndex === i ? '5' : '2.5'}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  cursor: 'pointer',
                  transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
                  // Widen the hit area with a transparent stroke
                  pointerEvents: 'stroke',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleClick(i)}
              />
            ))}

            {/* Invisible wider paths for easier hover targeting */}
            {segments.map((d, i) => (
              <path
                key={`hit-${i}`}
                d={d}
                stroke="transparent"
                strokeWidth="16"
                fill="none"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleClick(i)}
              />
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-muted-foreground/50 font-display uppercase tracking-wider">
            <span>{COMPLETED_STAGES.length} stages completed</span>
            <span className="text-muted-foreground/20">·</span>
            <span>Hover to explore · Click for archive</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RouteMapPage;
