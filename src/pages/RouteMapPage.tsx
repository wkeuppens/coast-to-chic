import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { smoothPath } from '@/lib/pathSmoothing';
import { fetchAndParseSVG } from '@/lib/svgCache';
import { STAGES } from '@/data/stages';

const COMPLETED_STAGES = STAGES.filter(s => s.status === 'Completed');
const PATH_FRACTION = 0.88;

/**
 * Piecewise-linear mapping from stage fraction to path fraction.
 * Reference points: (stageNumber, pathPosition) pairs where
 * pathPosition = the uniform-index where that stage should appear.
 */
const CALIBRATION_POINTS: [number, number][] = [
  [0, 0],
  [96, 85],
  [124, 116],
  [130, 122],
  [161, 158],
];

function stageToPathFraction(stageIndex: number, totalStages: number): number {
  const stageFrac = stageIndex / totalStages;
  // Build normalized reference points
  const pts = CALIBRATION_POINTS.map(([s, p]) => [s / totalStages, p / totalStages] as [number, number]);
  pts.push([1, 1]); // end point

  for (let i = 0; i < pts.length - 1; i++) {
    const [s0, p0] = pts[i];
    const [s1, p1] = pts[i + 1];
    if (stageFrac >= s0 && stageFrac <= s1) {
      const t = s1 === s0 ? 0 : (stageFrac - s0) / (s1 - s0);
      return p0 + t * (p1 - p0);
    }
  }
  return stageFrac; // fallback
}

function splitPathIntoSegments(
  pathEl: SVGPathElement,
  segmentCount: number,
  fraction: number
): string[] {
  const totalLen = pathEl.getTotalLength() * fraction;
  const segments: string[] = [];

  for (let i = 0; i < segmentCount; i++) {
    const startFrac = stageToPathFraction(i, segmentCount);
    const endFrac = stageToPathFraction(i + 1, segmentCount);
    const start = startFrac * totalLen;
    const end = endFrac * totalLen;
    const segLen = end - start;
    const points: { x: number; y: number }[] = [];
    const steps = Math.max(8, Math.ceil(segLen / 3));
    for (let s = 0; s <= steps; s++) {
      const t = start + segLen * (s / steps);
      const pt = pathEl.getPointAtLength(t);
      points.push({ x: pt.x, y: pt.y });
    }
    const d = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    segments.push(d);
  }

  return segments;
}

/** Get midpoint of a segment for placing indicator */
function getSegmentMidpoint(pathD: string): { x: number; y: number } | null {
  const matches = pathD.match(/[ML]([\d.-]+),([\d.-]+)/g);
  if (!matches || matches.length === 0) return null;
  const mid = Math.floor(matches.length / 2);
  const m = matches[mid].match(/([\d.-]+),([\d.-]+)/);
  if (!m) return null;
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

const RouteMapPage = () => {
  const navigate = useNavigate();
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState('0 0 800 600');
  const [segments, setSegments] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hiddenPathRef = useRef<SVGPathElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    fetchAndParseSVG('/route-map.svg', (d) => smoothPath(d, 3, 1.2, false))
      .then(result => {
        if (result) {
          setPathData(result.pathData);
          setViewBox(result.viewBox);
        }
      });
  }, [isMobile]);

  useEffect(() => {
    if (!hiddenPathRef.current || !pathData) return;
    const segs = splitPathIntoSegments(hiddenPathRef.current, COMPLETED_STAGES.length, PATH_FRACTION);
    setSegments(segs);
  }, [pathData]);

  const hoveredStage = hoveredIndex !== null ? COMPLETED_STAGES[hoveredIndex] : null;
  const hoveredMidpoint = useMemo(() => {
    if (hoveredIndex === null || !segments[hoveredIndex]) return null;
    return getSegmentMidpoint(segments[hoveredIndex]);
  }, [hoveredIndex, segments]);

  const handleClick = useCallback((index: number) => {
    const stage = COMPLETED_STAGES[index];
    if (stage) navigate(`/archive?stage=${stage.stageNumber}`);
  }, [navigate]);

  if (isMobile) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-8 text-center">
        <SEO title="Route Map" description="Explore the full coastline route, stage by stage." path="/route-map" />
        <p className="font-display text-lg text-foreground mb-2">Route Map</p>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs">
          The interactive route map is best experienced on a larger screen.
        </p>
        <Link to="/archive" className="text-sm font-display text-accent hover:text-accent/80 transition-colors">
          ← Explore the Archive instead
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <SEO title="Route Map" description="Explore the full coastline route, stage by stage." path="/route-map" />
      <SEO title="Route Map" description="Explore the full coastline route, stage by stage." path="/route-map" />

      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-6">
        <Link
          to="/archive"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 font-display"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Archive
        </Link>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40 font-display">
          Route Map
        </span>
      </header>

      {/* Map */}
      <div className="flex items-center justify-center min-h-screen px-8 lg:px-20">
        <div className="w-full max-w-6xl relative">
          <svg
            viewBox={viewBox}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            <defs>
              {/* Refined glow — warm accent halo */}
              <filter id="seg-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                <feFlood floodColor="hsl(var(--accent))" floodOpacity="0.35" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Dot glow */}
              <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hidden measurement path */}
            {pathData && (
              <path ref={hiddenPathRef} d={pathData} stroke="none" fill="none" />
            )}

            {/* Ghost path — full coastline */}
            {pathData && (
              <path
                d={pathData}
                stroke="hsl(var(--foreground))"
                strokeWidth="0.5"
                strokeOpacity="0.06"
                fill="none"
              />
            )}

            {/* Completed route — single continuous base line */}
            {segments.length > 0 && (
              <path
                d={segments.join(' ')}
                stroke="hsl(var(--foreground))"
                strokeWidth="1.2"
                strokeOpacity={hoveredIndex !== null ? 0.15 : 0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
                style={{
                  transition: 'stroke-opacity 0.3s ease',
                }}
              />
            )}

            {/* Highlighted segment on hover */}
            {hoveredIndex !== null && segments[hoveredIndex] && (
              <path
                d={segments[hoveredIndex]}
                stroke="hsl(var(--foreground))"
                strokeWidth="2.5"
                strokeOpacity="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
                filter="url(#seg-glow)"
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Accent overlay on hovered segment */}
            {hoveredIndex !== null && segments[hoveredIndex] && (
              <path
                d={segments[hoveredIndex]}
                stroke="hsl(var(--accent))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
                filter="url(#seg-glow)"
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Invisible hit areas — wide for magnetic/sticky feel */}
            {segments.map((d, i) => (
              <path
                key={`hit-${i}`}
                d={d}
                stroke="transparent"
                strokeWidth="40"
                fill="none"
                style={{ cursor: 'none' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleClick(i)}
              />
            ))}

            {/* Indicator dot at midpoint of hovered segment */}
            {hoveredMidpoint && (
              <>
                <circle
                  cx={hoveredMidpoint.x}
                  cy={hoveredMidpoint.y}
                  r="5"
                  fill="hsl(var(--accent))"
                  filter="url(#dot-glow)"
                  style={{ pointerEvents: 'none' }}
                />
                <circle
                  cx={hoveredMidpoint.x}
                  cy={hoveredMidpoint.y}
                  r="2"
                  fill="hsl(var(--background))"
                  style={{ pointerEvents: 'none' }}
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom info bar — editorial layout */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30">
        <div className="bg-background/90 backdrop-blur-md px-8 lg:px-16 py-5">
          {hoveredStage ? (
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-6">
                <span className="text-[32px] font-display text-accent leading-none tracking-tight tabular-nums">
                  {String(hoveredStage.stageNumber).padStart(3, '0')}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-display text-foreground tracking-wide">
                    {hoveredStage.location}
                  </span>
                  <span className="text-[11px] text-muted-foreground tracking-wider uppercase">
                    {hoveredStage.country} · {hoveredStage.year}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-6">
                {hoveredStage.shoreholder && (
                  <span className="text-[11px] text-muted-foreground/60 font-display uppercase tracking-wider">
                    {hoveredStage.shoreholder}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground/30 font-display uppercase tracking-widest">
                  Click to view →
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground/30 font-display uppercase tracking-[0.2em]">
                Hover a segment to explore
              </span>
              <span className="text-[11px] text-muted-foreground/20 font-display uppercase tracking-[0.2em]">
                {COMPLETED_STAGES.length} stages · Europe
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RouteMapPage;
