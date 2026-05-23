import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

// ── Pre-projected coordinates ─────────────────────────────────────────────────
// Mercator projection, viewBox 800×600
// Europe bounding box: lon -25→40, lat 34→72

const COMPLETED_PTS: [number,number][] = [
  [348.3,393.8],[339.1,397.9],[287.4,430.1],[252.6,433.7],[273.7,443.1],
  [288.6,462.1],[294.5,468.3],[293.2,480.6],[287.0,495.8],[285.8,496.2],
  [271.8,496.8],[204.3,495.8],[193.8,501.7],[200.4,517.9],[195.2,549.3],
  [196.9,568.0],[241.8,577.3],[303.0,561.6],[314.1,529.9],[334.3,519.2],
  [346.5,506.8],[373.5,496.8],[397.2,492.0],[399.0,491.6],[417.6,483.6],
  [429.8,487.8],[437.2,493.8],[446.2,501.5],[458.5,517.3],[479.0,527.9],
  [500.1,558.1],
  // Adriatic east coast (after going round heel of Italy)
  [531.9,529.5],[518.2,523.7],[512.0,516.3],[482.7,522.5],[462.5,487.8],
  [477.2,468.3],[485.5,474.1],
  // Croatian coast going SE
  [510.0,494.4],[530.5,504.5],[536.0,506.8],
]

const IN_PROGRESS_PTS: [number,number][] = [
  [536.0,506.8],[542.8,513.5],[551.4,519.8],[547.4,519.8],[556.6,536.3],
  [554.1,541.5],[558.5,539.7],[575.0,554.5],[589.9,557.8],[599.6,557.8],
  [605.3,553.4],[603.3,550.4],[590.0,542.2],
]

const PLANNED_PTS: [number,number][] = [
  [590.0,542.2],[590.2,527.6],[614.4,525.3],[639.0,523.8],[651.7,526.8],[664.2,523.5],
]

const FUTURE_PTS: [number,number][] = [
  [625.0,22.7],[484.9,117.8],[373.2,216.1],[373.3,253.5],[378.1,278.0],
  [415.0,291.6],[439.1,267.7],[429.8,309.4],[424.9,325.1],[429.8,332.8],
  [411.7,333.8],[410.8,333.8],[364.6,379.4],[348.3,393.8],
]

// Iceland inset (x:20-170, y:12-95)
const ICELAND_PTS: [number,number][] = [
  [50.4,74.4],[68.7,82.9],[89.4,82.9],[111.3,76.5],[129.6,65.9],
  [153.9,38.3],[141.7,23.5],[111.3,17.1],[80.9,17.1],[56.5,32.0],
  [32.2,38.3],[26.1,53.2],[38.3,70.2],[50.4,74.4],
]
const REYKJAVIK: [number,number] = [51.3, 67.2]

// Very faint European continent silhouette — key coastal vertices only
// Gives geographic context without distracting from the route
const EUROPE_SILHOUETTE: [number,number][] = [
  // Norway/Scandinavia rough west outline
  [439.1,267.7],[415.0,291.6],[429.8,309.4],[424.9,325.1],
  [411.7,333.8],[364.6,379.4],
  // British Isles hint (very rough)
  [263.9,345.0],[248.9,362.0],[255.4,390.0],[290.4,411.0],[310.0,402.0],
  // France Atlantic
  [287.4,430.1],[273.7,443.1],[288.6,462.1],[293.2,480.6],
  // Iberia
  [271.8,496.8],[204.3,495.8],[193.8,501.7],[196.9,568.0],[241.8,577.3],
  // Mediterranean Spain + France
  [303.0,561.6],[334.3,519.2],[373.5,496.8],[399.0,491.6],
  // Italy west + south
  [417.6,483.6],[458.5,517.3],[500.1,558.1],[518.8,543.1],
  // Italy east (Adriatic)
  [531.9,529.5],[518.2,523.7],[482.7,522.5],[462.5,487.8],[477.2,468.3],
  // Slovenia/Croatia
  [485.5,474.1],[510.0,494.4],[536.0,506.8],
  // Balkans rough
  [542.8,513.5],[551.4,519.8],[575.0,554.5],[590.0,542.2],
  // Greece
  [599.6,557.8],[605.3,553.4],[590.0,542.2],
  // Turkey/Bosphorus hint
  [614.4,525.3],[664.2,523.5],
]

// ── Path builders ─────────────────────────────────────────────────────────────

// Simple polyline — no smoothing, avoids wild bezier swings
function ptsToPolyline(pts: [number,number][]): string {
  if (!pts.length) return ''
  return `M ${pts.map(p => `${p[0]} ${p[1]}`).join(' L ')}`
}

// Mild smoothing only — uses smaller tension (0.12) to avoid overshooting
function ptsToSmooth(pts: [number,number][]): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const prevPrev = pts[i - 2] ?? prev
    const next = pts[i + 1] ?? curr
    const tension = 0.12
    const cp1x = prev[0] + (curr[0] - prevPrev[0]) * tension
    const cp1y = prev[1] + (curr[1] - prevPrev[1]) * tension
    const cp2x = curr[0] - (next[0] - prev[0]) * tension
    const cp2y = curr[1] - (next[1] - prev[1]) * tension
    d.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${curr[0]} ${curr[1]}`)
  }
  return d.join(' ')
}

// ── Date logic ────────────────────────────────────────────────────────────────

const TODAY = new Date()
const DATES = {
  inProgressStart: new Date('2026-10-08'),
  inProgressEnd:   new Date('2026-11-23'),
  icelandStart:    new Date('2027-06-12'),
  icelandEnd:      new Date('2027-07-13'),
}

type Phase = 'before_progress' | 'in_progress' | 'between' | 'iceland' | 'post_iceland'

function getPhase(): Phase {
  if (TODAY < DATES.inProgressStart) return 'before_progress'
  if (TODAY <= DATES.inProgressEnd) return 'in_progress'
  if (TODAY < DATES.icelandStart) return 'between'
  if (TODAY <= DATES.icelandEnd) return 'iceland'
  return 'post_iceland'
}

function getInProgressFraction(): number {
  const total = DATES.inProgressEnd.getTime() - DATES.inProgressStart.getTime()
  const elapsed = TODAY.getTime() - DATES.inProgressStart.getTime()
  return Math.max(0, Math.min(1, elapsed / total))
}

function interpolateAlongPts(pts: [number,number][], t: number): [number,number] {
  if (t <= 0) return pts[0]
  if (t >= 1) return pts[pts.length - 1]
  const lengths: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i-1][0]
    const dy = pts[i][1] - pts[i-1][1]
    lengths.push(lengths[i-1] + Math.sqrt(dx*dx + dy*dy))
  }
  const target = t * lengths[lengths.length - 1]
  for (let i = 1; i < lengths.length; i++) {
    if (lengths[i] >= target) {
      const segT = (target - lengths[i-1]) / (lengths[i] - lengths[i-1])
      return [
        pts[i-1][0] + segT * (pts[i][0] - pts[i-1][0]),
        pts[i-1][1] + segT * (pts[i][1] - pts[i-1][1]),
      ]
    }
  }
  return pts[pts.length - 1]
}

function clipPtsToFraction(pts: [number,number][], t: number): [number,number][] {
  if (t >= 1) return pts
  const pos = interpolateAlongPts(pts, t)
  const lengths: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i-1][0]
    const dy = pts[i][1] - pts[i-1][1]
    lengths.push(lengths[i-1] + Math.sqrt(dx*dx + dy*dy))
  }
  const target = t * lengths[lengths.length - 1]
  const clipped: [number,number][] = []
  for (let i = 0; i < pts.length; i++) {
    if (lengths[i] < target) clipped.push(pts[i])
    else { clipped.push(pos); break }
  }
  return clipped
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ActiveDot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={2} />
      <motion.circle cx={x} cy={y} r={6} fill="none" stroke="hsl(var(--accent))" strokeWidth={1.5}
        initial={{ scale: 1, opacity: 0.7 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }} />
    </g>
  )
}

function SmallDot({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="hsl(var(--foreground))" opacity={0.45} />
}

function Label({ x, y, text, above = true }: { x: number; y: number; text: string; above?: boolean }) {
  const oy = above ? -14 : 16
  return (
    <g>
      <rect x={x - 44} y={y + oy - 9} width={88} height={14} rx={2}
        fill="hsl(var(--background))" fillOpacity={0.9} />
      <text x={x} y={y + oy} textAnchor="middle"
        fill="hsl(var(--foreground))" fontSize={9.5}
        fontFamily="var(--font-body)" letterSpacing="0.08em" opacity={0.75}>
        {text}
      </text>
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export const RouteMap = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const phase = useMemo(getPhase, [])
  const frac = useMemo(getInProgressFraction, [])

  const completedPath = useMemo(() => ptsToSmooth(COMPLETED_PTS), [])

  const inProgressPath = useMemo(() => {
    if (phase === 'before_progress') return ''
    if (phase === 'in_progress') return ptsToSmooth(clipPtsToFraction(IN_PROGRESS_PTS, frac))
    return ptsToSmooth(IN_PROGRESS_PTS)
  }, [phase, frac])

  const plannedPath  = useMemo(() => ptsToPolyline(PLANNED_PTS), [])
  const futurePath   = useMemo(() => ptsToPolyline(FUTURE_PTS), [])
  const icelandPath  = useMemo(() => ptsToSmooth(ICELAND_PTS), [])

  const activeDot = useMemo((): [number,number] => {
    if (phase === 'before_progress') return [536.0, 506.8]
    if (phase === 'in_progress') return interpolateAlongPts(IN_PROGRESS_PTS, frac)
    return [590.0, 542.2]
  }, [phase, frac])

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none">

        {/* Continent silhouette — very faint reference shape */}
        <path
          d={ptsToSmooth(EUROPE_SILHOUETTE)}
          stroke="hsl(var(--foreground))"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.04}
          fill="none"
        />

        {/* ── Iceland inset ── */}
        <rect x={14} y={9} width={158} height={88} rx={4}
          fill="hsl(var(--background))" fillOpacity={0.5}
          stroke="hsl(var(--foreground))" strokeWidth={0.5} strokeOpacity={0.15} />

        <motion.path d={icelandPath}
          stroke="hsl(var(--foreground))" strokeWidth={1.5}
          strokeLinecap="round" opacity={0.4}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }} />

        {phase === 'iceland'
          ? <ActiveDot x={REYKJAVIK[0]} y={REYKJAVIK[1]} />
          : <SmallDot x={REYKJAVIK[0]} y={REYKJAVIK[1]} r={2.5} />}

        <text x={92} y={100} textAnchor="middle"
          fill="hsl(var(--foreground))" fontSize={7.5}
          fontFamily="var(--font-body)" letterSpacing="0.1em" opacity={0.4}>
          ICELAND 2027
        </text>

        {/* ── Future route (Norway → Belgium) — very faint ── */}
        {isInView && (
          <motion.path d={futurePath}
            stroke="hsl(var(--foreground))"
            strokeWidth={1} strokeLinecap="round" strokeDasharray="3 7"
            opacity={0.1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 2.8 }} />
        )}

        {/* ── Planned route (Volos → Istanbul) ── */}
        {isInView && (
          <motion.path d={plannedPath}
            stroke="hsl(var(--foreground))"
            strokeWidth={1.5} strokeLinecap="round" strokeDasharray="6 5"
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 2.2 }} />
        )}

        {/* ── In-progress route (Oct–Nov 2026) ── */}
        {isInView && inProgressPath && (
          <motion.path d={inProgressPath}
            stroke="hsl(var(--accent))"
            strokeWidth={2.5} strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 1.8 }} />
        )}

        {/* ── Completed route ── */}
        {isInView && (
          <motion.path d={completedPath}
            stroke="hsl(var(--foreground))"
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            opacity={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }} />
        )}

        {/* ── Dots ── */}
        <motion.g initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.0 }}>
          <SmallDot x={348.3} y={393.8} r={4} />
          <Label x={348.3} y={393.8} text="KNOKKE" above />
        </motion.g>

        <motion.g initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.1 }}>
          <ActiveDot x={activeDot[0]} y={activeDot[1]} />
          <Label x={activeDot[0]} y={activeDot[1]} text="WE ARE HERE" above />
        </motion.g>

        {(phase === 'between' || phase === 'iceland' || phase === 'post_iceland') && (
          <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.3 }}>
            <SmallDot x={590.0} y={542.2} r={3} />
            <Label x={590.0} y={542.2} text="VOLOS NOV '26" above={false} />
          </motion.g>
        )}

        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.4 }}>
          <SmallDot x={664.2} y={523.5} r={3} />
          <Label x={664.2} y={523.5} text="ISTANBUL" above />
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 3.0 }}>
          <circle cx={625.0} cy={22.7} r={2.5} fill="hsl(var(--foreground))" opacity={0.15} />
          <text x={625.0} y={14} textAnchor="middle"
            fill="hsl(var(--foreground))" fontSize={7.5} opacity={0.2}
            fontFamily="var(--font-body)" letterSpacing="0.08em">
            NORWAY →
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
