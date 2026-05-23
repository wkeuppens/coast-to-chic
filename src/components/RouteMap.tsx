import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

// ── Projection ────────────────────────────────────────────────────────────────
// Pre-projected coordinates (Mercator, viewBox 800×600, Europe lon -25→40, lat 34→72)

// ── Route segments ────────────────────────────────────────────────────────────

const COMPLETED_PTS = [
  [348.3,393.8],[339.1,397.9],[287.4,430.1],[252.6,433.7],[273.7,443.1],
  [288.6,462.1],[294.5,468.3],[293.2,480.6],[287.0,495.8],[285.8,496.2],
  [271.8,496.8],[204.3,495.8],[193.8,501.7],[200.4,517.9],[195.2,549.3],
  [196.9,568.0],[241.8,577.3],[303.0,561.6],[314.1,529.9],[334.3,519.2],
  [346.5,506.8],[373.5,496.8],[397.2,492.0],[399.0,491.6],[417.6,483.6],
  [429.8,487.8],[437.2,493.8],[446.2,501.5],[458.5,517.3],[479.0,527.9],
  [500.1,558.1],[518.8,543.1],[531.9,529.5],[518.2,523.7],[512.0,516.3],
  [482.7,522.5],[462.5,487.8],[477.2,468.3],[476.6,469.9],[478.2,472.4],
  [485.5,474.1],[510.0,494.4],[530.5,504.5],[536.0,506.8],
]

// Oct 8 – Nov 23 2026: Montenegro → Volos
const IN_PROGRESS_PTS = [
  [536.0,506.8],[542.8,513.5],[551.4,519.8],[547.4,519.8],[556.6,536.3],
  [554.1,541.5],[558.5,539.7],[575.0,554.5],[589.9,557.8],[599.6,557.8],
  [605.3,553.4],[603.3,550.4],[590.0,542.2],
]

// 2027 after Iceland: Volos → Istanbul
const PLANNED_PTS = [
  [590.0,542.2],[590.2,527.6],[614.4,525.3],[639.0,523.8],[651.7,526.8],[664.2,523.5],
]

// Future: Norway → Belgium (closes the loop)
const FUTURE_PTS = [
  [625.0,22.7],[484.9,117.8],[373.2,216.1],[373.3,253.5],[378.1,278.0],
  [415.0,291.6],[439.1,267.7],[429.8,309.4],[424.9,325.1],[429.8,332.8],
  [411.7,333.8],[410.8,333.8],[364.6,379.4],[348.3,393.8],
]

// Iceland inset outline (upper-left box, SVG x:20-160, y:15-85)
const ICELAND_PTS = [
  [50.4,74.4],[68.7,82.9],[89.4,82.9],[111.3,76.5],[129.6,65.9],
  [153.9,38.3],[141.7,23.5],[111.3,17.1],[80.9,17.1],[56.5,32.0],
  [32.2,38.3],[26.1,53.2],[38.3,70.2],[50.4,74.4],
]

const REYKJAVIK = [51.3, 67.2]

// ── Path builder ─────────────────────────────────────────────────────────────

function pointsToPath(pts: number[][]): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const next = pts[i + 1] ?? curr
    // Smooth catmull-rom-ish control points
    const cp1x = prev[0] + (curr[0] - (pts[i - 2]?.[0] ?? prev[0])) * 0.2
    const cp1y = prev[1] + (curr[1] - (pts[i - 2]?.[1] ?? prev[1])) * 0.2
    const cp2x = curr[0] - (next[0] - prev[0]) * 0.2
    const cp2y = curr[1] - (next[1] - prev[1]) * 0.2
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

function interpolateAlongPath(pts: number[][], t: number): [number, number] {
  if (t <= 0) return [pts[0][0], pts[0][1]]
  if (t >= 1) return [pts[pts.length - 1][0], pts[pts.length - 1][1]]

  // Calculate cumulative segment lengths
  const lengths: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i-1][0]
    const dy = pts[i][1] - pts[i-1][1]
    lengths.push(lengths[i-1] + Math.sqrt(dx*dx + dy*dy))
  }
  const total = lengths[lengths.length - 1]
  const target = t * total

  for (let i = 1; i < lengths.length; i++) {
    if (lengths[i] >= target) {
      const segT = (target - lengths[i-1]) / (lengths[i] - lengths[i-1])
      return [
        pts[i-1][0] + segT * (pts[i][0] - pts[i-1][0]),
        pts[i-1][1] + segT * (pts[i][1] - pts[i-1][1]),
      ]
    }
  }
  return [pts[pts.length-1][0], pts[pts.length-1][1]]
}

// Clip path to fraction
function clipPath(pts: number[][], t: number): number[][] {
  if (t >= 1) return pts
  const pos = interpolateAlongPath(pts, t)

  const lengths: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i-1][0]
    const dy = pts[i][1] - pts[i-1][1]
    lengths.push(lengths[i-1] + Math.sqrt(dx*dx + dy*dy))
  }
  const total = lengths[lengths.length - 1]
  const target = t * total

  const clipped: number[][] = []
  for (let i = 0; i < pts.length; i++) {
    if (lengths[i] < target) {
      clipped.push(pts[i])
    } else {
      clipped.push(pos)
      break
    }
  }
  return clipped
}

// ── Dot component ─────────────────────────────────────────────────────────────

function ActiveDot({ x, y, pulse = true }: { x: number; y: number; pulse?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={2.5} />
      {pulse && (
        <motion.circle
          cx={x} cy={y} r={7}
          fill="none" stroke="hsl(var(--accent))" strokeWidth={2}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }}
        />
      )}
    </g>
  )
}

function MapDot({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="hsl(var(--foreground))" opacity={0.5} />
}

function MapLabel({ x, y, text, offsetY = -16 }: { x: number; y: number; text: string; offsetY?: number }) {
  return (
    <g>
      <rect x={x - 46} y={y + offsetY - 10} width={92} height={15} rx={2}
        fill="hsl(var(--background))" fillOpacity={0.85} />
      <text x={x} y={y + offsetY} textAnchor="middle"
        fill="hsl(var(--foreground))" fontSize={10}
        fontFamily="var(--font-body)" letterSpacing="0.07em" opacity={0.8}>
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
  const inProgressFrac = useMemo(getInProgressFraction, [])

  // Build paths
  const completedPath = useMemo(() => pointsToPath(COMPLETED_PTS), [])
  const inProgressPath = useMemo(() => {
    if (phase === 'in_progress') {
      return pointsToPath(clipPath(IN_PROGRESS_PTS, inProgressFrac))
    }
    if (phase === 'before_progress') return ''
    return pointsToPath(IN_PROGRESS_PTS)
  }, [phase, inProgressFrac])

  const plannedPath = useMemo(() => pointsToPath(PLANNED_PTS), [])
  const futurePath  = useMemo(() => pointsToPath(FUTURE_PTS), [])
  const icelandPath = useMemo(() => pointsToPath(ICELAND_PTS), [])

  // Current dot position
  const activeDotPos = useMemo((): [number, number] => {
    if (phase === 'before_progress') return [536.0, 506.8] // Croatia/Montenegro
    if (phase === 'in_progress') return interpolateAlongPath(IN_PROGRESS_PTS, inProgressFrac)
    return [590.0, 542.2] // Volos
  }, [phase, inProgressFrac])

  // Animation timing
  const totalSegments = 4 // completed, in_progress, planned, future
  const segDuration = 2.0
  const completedDelay = 0.3
  const inProgressDelay = completedDelay + segDuration * 0.8
  const plannedDelay = inProgressDelay + segDuration * 0.6
  const futureDelay = plannedDelay + segDuration * 0.5

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none">

        {/* ── Iceland inset ── */}
        <g opacity={0.9}>
          {/* Inset border */}
          <rect x={15} y={10} width={155} height={82} rx={4}
            fill="hsl(var(--background))" fillOpacity={0.6}
            stroke="hsl(var(--foreground))" strokeWidth={0.5} strokeOpacity={0.2} />

          {/* Iceland outline */}
          <motion.path
            d={icelandPath}
            stroke="hsl(var(--foreground))"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Iceland relay dot */}
          {(phase === 'iceland') && (
            <ActiveDot x={REYKJAVIK[0]} y={REYKJAVIK[1]} />
          )}
          {phase !== 'iceland' && (
            <MapDot x={REYKJAVIK[0]} y={REYKJAVIK[1]} r={3} />
          )}

          {/* Iceland label */}
          <text x={90} y={94} textAnchor="middle"
            fill="hsl(var(--foreground))" fontSize={8}
            fontFamily="var(--font-body)" letterSpacing="0.1em" opacity={0.5}>
            ICELAND 2027
          </text>
        </g>

        {/* ── Completed route ── */}
        {isInView && (
          <motion.path
            d={completedPath}
            stroke="hsl(var(--foreground))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: segDuration, ease: 'easeInOut', delay: completedDelay }}
          />
        )}

        {/* ── In-progress route (Oct–Nov 2026) ── */}
        {isInView && inProgressPath && (
          <motion.path
            d={inProgressPath}
            stroke="hsl(var(--accent))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: phase === 'in_progress' ? segDuration * 0.6 : segDuration * 0.6,
              ease: 'easeInOut',
              delay: inProgressDelay,
            }}
          />
        )}

        {/* ── Planned route (Volos → Istanbul) ── */}
        {isInView && (
          <motion.path
            d={plannedPath}
            stroke="hsl(var(--foreground))"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="6 4"
            opacity={0.35}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: segDuration * 0.5, ease: 'easeInOut', delay: plannedDelay }}
          />
        )}

        {/* ── Future route (Norway → Belgium) ── */}
        {isInView && (
          <motion.path
            d={futurePath}
            stroke="hsl(var(--foreground))"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray="3 6"
            opacity={0.15}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: segDuration * 0.8, ease: 'easeInOut', delay: futureDelay }}
          />
        )}

        {/* ── Dots & labels ── */}

        {/* Knokke — start */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: completedDelay + 0.2 }}>
          <MapDot x={348.3} y={393.8} r={5} />
          <MapLabel x={348.3} y={393.8} text="KNOKKE" offsetY={-16} />
        </motion.g>

        {/* Current position dot */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: completedDelay + segDuration * 0.85 }}>
          <ActiveDot x={activeDotPos[0]} y={activeDotPos[1]} pulse={phase === 'before_progress' || phase === 'in_progress'} />
          <MapLabel
            x={activeDotPos[0]}
            y={activeDotPos[1]}
            text="WE ARE HERE"
            offsetY={-18}
          />
        </motion.g>

        {/* Volos — milestone (shown after in_progress completes) */}
        {(phase === 'between' || phase === 'iceland' || phase === 'post_iceland') && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: plannedDelay }}>
            <MapDot x={590.0} y={542.2} r={4} />
            <MapLabel x={590.0} y={542.2} text="VOLOS NOV '26" offsetY={14} />
          </motion.g>
        )}

        {/* Istanbul — planned endpoint */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: plannedDelay + 0.3 }}>
          <MapDot x={664.2} y={523.5} r={3} />
          <MapLabel x={664.2} y={523.5} text="ISTANBUL" offsetY={-14} />
        </motion.g>

        {/* Nordkapp */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: futureDelay + 0.2 }}>
          <circle cx={625.0} cy={22.7} r={3} fill="hsl(var(--foreground))" opacity={0.2} />
          <text x={625.0} y={14} textAnchor="middle"
            fill="hsl(var(--foreground))" fontSize={8} opacity={0.3}
            fontFamily="var(--font-body)" letterSpacing="0.08em">
            NORWAY →
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
