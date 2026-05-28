/**
 * Interactive Route Map — Easter egg
 * Reached by clicking the Europe outline on the homepage.
 * Hover any completed stage segment to see stage info.
 * Click to open that stage in the archive.
 */

import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { STAGES } from '@/data/stages';

const COMPLETED = STAGES.filter(s => s.status === 'Completed');

// Pre-projected completed route points (Croatia→Knokke, 116 pts)
// Source: Natural Earth path 13, seg[3], Mercator 800×600 lon-22→42 lat33→73
// Reversed so index 0 = Knokke (stage 1) and index N = Croatia (stage 239)
const RAW_COMPLETED_PTS: [number, number][] = [
  [316.4,396.7],[323.1,393.8],[329.8,390.9],[336.5,388.0],[343.2,385.1],
  [349.9,382.2],[356.6,379.3],[363.3,376.4],[370.0,373.5],[376.7,370.6],
  [332.8,383.1],[379.8,340.4],[380.6,340.4],[399.0,339.4],[394.0,332.2],
  [399.0,317.4],[408.5,278.3],[384.0,300.8],[346.5,288.0],[341.6,265.0],
  [341.5,229.8],[373.3,253.5],[373.2,216.1],[455.0,137.6],
  [415.0,291.6],[439.1,267.7],[429.8,309.4],[424.9,325.1],[429.8,332.8],
  [411.7,333.8],[410.8,333.8],[364.6,379.4],[348.3,393.8],
  [339.1,397.9],[287.4,430.8],[219.0,434.1],[240.5,443.0],
  [255.6,460.8],[261.6,466.6],[260.2,478.1],[254.0,492.5],[252.8,492.8],
  [238.5,493.4],[170.0,492.5],[159.4,498.0],[166.0,513.1],[160.8,542.7],
  [162.5,560.2],[208.1,568.9],[270.2,554.2],[281.5,524.4],[302.0,514.4],
  [314.4,502.8],[341.9,493.4],[365.9,488.9],[367.8,488.5],[386.6,481.0],
  [399.0,484.9],[406.5,490.6],[415.6,497.8],[428.1,512.6],[449.0,522.6],
  [470.4,550.9],[489.4,536.8],[502.8,524.1],[488.8,518.7],[482.5,511.7],
  [452.8,517.5],[432.2,484.9],[447.1,466.6],[446.5,468.1],[448.1,470.4],
  [455.6,472.1],[480.5,491.1],[501.2,500.6],[505.6,502.4],
];

// Reversed so stage 0 = Knokke, stage N-1 = Croatia (matches COMPLETED array)
const COMPLETED_PTS = [...RAW_COMPLETED_PTS].reverse();

// Catmull-Rom smooth for a sub-array of points
function smooth(pts: [number, number][], t = 0.45): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i-2] ?? pts[i-1], p1 = pts[i-1], p2 = pts[i], p3 = pts[i+1] ?? pts[i]
    const cp1x = p1[0]+(p2[0]-p0[0])*t/2, cp1y = p1[1]+(p2[1]-p0[1])*t/2
    const cp2x = p2[0]-(p3[0]-p1[0])*t/2, cp2y = p2[1]-(p3[1]-p1[1])*t/2
    d.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}

function getPathMid(pts: [number,number][]): [number,number] | null {
  if (!pts.length) return null
  const m = pts[Math.floor(pts.length / 2)]
  return m ?? null
}

// Split COMPLETED_PTS into N equal chunks (one per stage)
function buildSegments(n: number): [number,number][][] {
  const total = COMPLETED_PTS.length
  return Array.from({ length: n }, (_, i) => {
    const start = Math.round(i * total / n)
    const end = Math.round((i + 1) * total / n)
    return COMPLETED_PTS.slice(Math.max(0, start - 1), end + 1) as [number,number][]
  })
}

const RouteMapPage = () => {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const segments = useMemo(() => buildSegments(COMPLETED.length), []);
  const segPaths  = useMemo(() => segments.map(s => smooth(s)), [segments]);
  const hoveredStage = hoveredIdx !== null ? COMPLETED[hoveredIdx] : null;
  const midpoint = useMemo(() => {
    if (hoveredIdx === null) return null
    return getPathMid(segments[hoveredIdx])
  }, [hoveredIdx, segments]);

  const handleClick = useCallback((i: number) => {
    const s = COMPLETED[i]
    if (s) navigate(`/archive?stage=${s.stageNumber}`)
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden select-none">
      <SEO
        title="Route Map"
        description="Explore the Follow the Coast route, stage by stage."
        path="/route-map"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-6">
        <Link to="/archive"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300">
          <ArrowLeft className="w-3.5 h-3.5" />Archive
        </Link>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Route Map
        </span>
      </header>

      {/* Map */}
      <div className="flex items-center justify-center min-h-screen px-8 lg:px-20" style={{ cursor: 'none' }}>
        <div className="w-full max-w-6xl relative">
          <svg viewBox="0 15 670 565" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" fill="none">
            <defs>
              <filter id="seg-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                <feFlood floodColor="hsl(var(--accent))" floodOpacity="0.4" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Ghost — full completed path, very faint */}
            <path d={smooth(COMPLETED_PTS)} stroke="hsl(var(--foreground))"
              strokeWidth={0.6} strokeOpacity={0.08} fill="none" strokeLinecap="round" />

            {/* Rendered segments — dim unless hovered */}
            {segPaths.map((d, i) => (
              <path key={`seg-${i}`} d={d}
                stroke="hsl(var(--foreground))"
                strokeWidth={hoveredIdx === i ? 2.5 : 0.8}
                strokeOpacity={hoveredIdx === null ? 0.18 : hoveredIdx === i ? 1 : 0.06}
                strokeLinecap="round" strokeLinejoin="round" fill="none"
                filter={hoveredIdx === i ? 'url(#seg-glow)' : undefined}
                style={{ transition: 'stroke-opacity 0.15s, stroke-width 0.15s', pointerEvents: 'none' }}
              />
            ))}

            {/* Accent overlay on hover */}
            {hoveredIdx !== null && segPaths[hoveredIdx] && (
              <path d={segPaths[hoveredIdx]}
                stroke="hsl(var(--accent))"
                strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
                filter="url(#seg-glow)" style={{ pointerEvents: 'none' }} />
            )}

            {/* Invisible wide hit areas */}
            {segPaths.map((d, i) => (
              <path key={`hit-${i}`} d={d}
                stroke="transparent" strokeWidth={28} fill="none"
                style={{ cursor: 'none' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleClick(i)} />
            ))}

            {/* Midpoint dot */}
            {midpoint && (
              <>
                <circle cx={midpoint[0]} cy={midpoint[1]} r={5}
                  fill="hsl(var(--accent))" filter="url(#dot-glow)"
                  style={{ pointerEvents: 'none' }} />
                <circle cx={midpoint[0]} cy={midpoint[1]} r={2}
                  fill="hsl(var(--background))" style={{ pointerEvents: 'none' }} />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30">
        <div className="bg-background/90 backdrop-blur-md px-8 lg:px-16 py-5">
          {hoveredStage ? (
            <motion.div key={hoveredStage.stageNumber}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-6">
                <span className="text-[32px] text-accent leading-none tracking-tight tabular-nums">
                  {String(hoveredStage.stageNumber).padStart(3, '0')}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-foreground tracking-wide">{hoveredStage.location}</span>
                  <span className="text-[11px] text-muted-foreground tracking-wider uppercase">
                    {hoveredStage.country} · {hoveredStage.year}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-6">
                {hoveredStage.shoreholder && (
                  <span className="text-[11px] text-muted-foreground/60 uppercase tracking-wider">
                    {hoveredStage.shoreholder}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
                  Click to view →
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                Hover a segment to explore
              </span>
              <span className="text-[11px] text-muted-foreground/20 uppercase tracking-[0.2em]">
                {COMPLETED.length} stages · Europe
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RouteMapPage;
