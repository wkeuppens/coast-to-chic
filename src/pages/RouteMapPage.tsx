import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { smoothPath } from '@/lib/pathSmoothing';
import { fetchAndParseSVG } from '@/lib/svgCache';
import { STAGES } from '@/data/stages';
import wavesLogo from '@/assets/waves-logo.png';

/**
 * Interactive segmented route map for the Archive.
 * Splits the coastline SVG path into one segment per completed stage,
 * ending at Venice (~88% of total path length).
 */

const COMPLETED_STAGES = STAGES.filter(s => s.status === 'Completed');

/** Only use this fraction of the total path for the 168 completed stages */
const PATH_FRACTION = 0.88;

function splitPathIntoSegments(
  pathEl: SVGPathElement,
  segmentCount: number,
  fraction: number
): string[] {
  const total = pathEl.getTotalLength() * fraction;
  const segLen = total / segmentCount;
  const segments: string[] = [];

  for (let i = 0; i < segmentCount; i++) {
    const start = i * segLen;
    const end = (i + 1) * segLen;
    const points: { x: number; y: number }[] = [];
    const steps = Math.max(8, Math.ceil(segLen / 3));
    for (let s = 0; s <= steps; s++) {
      const t = start + (end - start) * (s / steps);
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

const RouteMapPage = () => {
  const navigate = useNavigate();
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState('0 0 800 600');
  const [segments, setSegments] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hiddenPathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    fetchAndParseSVG('/route-map.svg', (d) => smoothPath(d, 3, 1.2, false))
      .then(result => {
        if (result) {
          setPathData(result.pathData);
          setViewBox(result.viewBox);
        }
      });
  }, []);

  useEffect(() => {
    if (!hiddenPathRef.current || !pathData) return;
    const segs = splitPathIntoSegments(hiddenPathRef.current, COMPLETED_STAGES.length, PATH_FRACTION);
    setSegments(segs);
  }, [pathData]);

  const hoveredStage = hoveredIndex !== null ? COMPLETED_STAGES[hoveredIndex] : null;

  const handleClick = useCallback((index: number) => {
    navigate('/archive');
  }, [navigate]);

  // Parse viewBox for logo positioning
  const vbParts = viewBox.split(' ').map(Number);
  const vbW = vbParts[2] || 800;
  const vbH = vbParts[3] || 600;

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

            {/* Waves logo on sea areas */}
            <defs>
              <pattern id="waves-pattern" patternUnits="objectBoundingBox" width="1" height="1">
                <image href={wavesLogo} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" opacity="0.06" />
              </pattern>
            </defs>

            {/* Waves logo — positioned in two sea areas */}
            <image
              href={wavesLogo}
              x={vbW * 0.02}
              y={vbH * 0.55}
              width={vbW * 0.12}
              height={vbW * 0.12}
              opacity="0.07"
              style={{ pointerEvents: 'none' }}
            />
            <image
              href={wavesLogo}
              x={vbW * 0.55}
              y={vbH * 0.25}
              width={vbW * 0.10}
              height={vbW * 0.10}
              opacity="0.07"
              style={{ pointerEvents: 'none' }}
            />

            {/* Base ghost path */}
            {pathData && (
              <path
                d={pathData}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                strokeOpacity="0.1"
                fill="none"
              />
            )}

            {/* Interactive segments */}
            {segments.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={hoveredIndex === i ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'}
                strokeWidth={hoveredIndex === i ? '4' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  cursor: 'pointer',
                  transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
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

          {/* Minimal info line — replaces popup card */}
          <div className="mt-6 flex items-baseline justify-between text-[11px] font-display uppercase tracking-wider">
            <div className="text-muted-foreground/40">
              {COMPLETED_STAGES.length} stages completed
            </div>
            <div className="text-right min-h-[1.2em]">
              {hoveredStage ? (
                <span className="text-foreground">
                  <span className="text-accent">{hoveredStage.title}</span>
                  <span className="text-muted-foreground mx-2">·</span>
                  <span className="text-muted-foreground">{hoveredStage.location}, {hoveredStage.country}</span>
                  {hoveredStage.shoreholder && (
                    <>
                      <span className="text-muted-foreground mx-2">·</span>
                      <span className="text-muted-foreground/60">{hoveredStage.shoreholder}</span>
                    </>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground/30">Hover to explore</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RouteMapPage;
