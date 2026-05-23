import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

// ── Route waypoints — Mercator projected, viewBox 800x600
// lon -22→42, lat 33→73
const COMPLETED: [number,number][] = [
  [316.2,396.7],[306.9,400.6],[254.4,430.8],[219.0,434.1],[240.5,443.0],
  [255.6,460.8],[261.6,466.6],[260.2,478.1],[254.0,492.5],[252.8,492.8],
  [238.5,493.4],[170.0,492.5],[159.4,498.0],[166.0,513.1],[160.8,542.7],
  [162.5,560.2],[208.1,568.9],[270.2,554.2],[281.5,524.4],[302.0,514.4],
  [314.4,502.8],[341.9,493.4],[365.9,488.9],[367.8,488.5],[386.6,481.0],
  [399.0,484.9],[406.5,490.6],[415.6,497.8],[428.1,512.6],[449.0,522.6],
  [470.4,550.9],[489.4,536.8],[502.8,524.1],[488.8,518.7],[482.5,511.7],
  [452.8,517.5],[432.2,484.9],[447.1,466.6],[446.5,468.1],[448.1,470.4],
  [455.6,472.1],[480.5,491.1],[501.2,500.6],[506.9,502.8],
]

const IN_PROGRESS: [number,number][] = [
  [506.9,502.8],[513.8,509.0],[522.5,515.0],[518.5,515.0],[527.8,530.5],
  [525.2,535.3],[529.8,533.7],[546.5,547.5],[561.6,550.6],[571.5,550.6],
  [577.2,546.5],[575.2,543.7],[561.8,536.0],
]

const PLANNED: [number,number][] = [
  [561.8,536.0],[561.9,522.3],[586.5,520.2],[611.5,518.8],[624.4,521.6],[637.1,518.4],
]

const FUTURE: [number,number][] = [
  [597.2,48.3],[455.0,137.6],[341.5,229.8],[341.6,265.0],[346.5,288.0],
  [384.0,300.8],[408.5,278.3],[399.0,317.4],[394.0,332.2],[399.0,339.4],
  [380.6,340.4],[379.8,340.4],[332.8,383.1],[316.2,396.7],
]

const ICELAND: [number,number][] = [
  [50.4,74.4],[68.7,82.9],[89.4,82.9],[111.3,76.5],[129.6,65.9],
  [153.9,38.3],[141.7,23.5],[111.3,17.1],[80.9,17.1],[56.5,32.0],
  [32.2,38.3],[26.1,53.2],[38.3,70.2],[50.4,74.4],
]
const REYKJAVIK: [number,number] = [51.3, 67.2]

// ── Smooth path builder (Catmull-Rom → cubic bezier, higher tension = rounder)
function smooth(pts: [number,number][], tension = 0.5): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 2] ?? pts[i - 1]
    const p1 = pts[i - 1]
    const p2 = pts[i]
    const p3 = pts[i + 1] ?? pts[i]
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension / 2
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension / 2
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension / 2
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension / 2
    d.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}

function polyline(pts: [number,number][]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

// ── Date logic
const TODAY = new Date()
const D = {
  inProgressStart: new Date('2026-10-08'),
  inProgressEnd:   new Date('2026-11-23'),
  icelandStart:    new Date('2027-06-12'),
  icelandEnd:      new Date('2027-07-13'),
}
type Phase = 'before_progress' | 'in_progress' | 'between' | 'iceland' | 'post_iceland'

function getPhase(): Phase {
  if (TODAY < D.inProgressStart) return 'before_progress'
  if (TODAY <= D.inProgressEnd)  return 'in_progress'
  if (TODAY < D.icelandStart)    return 'between'
  if (TODAY <= D.icelandEnd)     return 'iceland'
  return 'post_iceland'
}

function getFrac(): number {
  return Math.max(0, Math.min(1,
    (TODAY.getTime() - D.inProgressStart.getTime()) /
    (D.inProgressEnd.getTime() - D.inProgressStart.getTime())
  ))
}

function interp(pts: [number,number][], t: number): [number,number] {
  if (t <= 0) return pts[0]
  if (t >= 1) return pts[pts.length - 1]
  const lens: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i-1][0], dy = pts[i][1] - pts[i-1][1]
    lens.push(lens[i-1] + Math.sqrt(dx*dx + dy*dy))
  }
  const target = t * lens[lens.length - 1]
  for (let i = 1; i < lens.length; i++) {
    if (lens[i] >= target) {
      const st = (target - lens[i-1]) / (lens[i] - lens[i-1])
      return [p1x(pts, i-1, i, st), p1y(pts, i-1, i, st)]
    }
  }
  return pts[pts.length - 1]
}

function p1x(pts: [number,number][], a: number, b: number, t: number) {
  return pts[a][0] + t * (pts[b][0] - pts[a][0])
}
function p1y(pts: [number,number][], a: number, b: number, t: number) {
  return pts[a][1] + t * (pts[b][1] - pts[a][1])
}

function clip(pts: [number,number][], t: number): [number,number][] {
  if (t >= 1) return pts
  const pos = interp(pts, t)
  const lens: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i-1][0], dy = pts[i][1] - pts[i-1][1]
    lens.push(lens[i-1] + Math.sqrt(dx*dx + dy*dy))
  }
  const target = t * lens[lens.length - 1]
  const out: [number,number][] = []
  for (let i = 0; i < pts.length; i++) {
    if (lens[i] < target) out.push(pts[i])
    else { out.push(pos); break }
  }
  return out
}

// ── Sub-components
function Pulse({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={2} />
      <motion.circle cx={x} cy={y} r={6} fill="none" stroke="hsl(var(--accent))" strokeWidth={1.5}
        initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }} />
    </g>
  )
}

function Dot({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="hsl(var(--foreground))" opacity={0.5} />
}

function Label({ x, y, text, above = true }: { x: number; y: number; text: string; above?: boolean }) {
  const oy = above ? -14 : 16
  return (
    <g>
      <rect x={x - 46} y={y + oy - 9} width={92} height={14} rx={2}
        fill="hsl(var(--background))" fillOpacity={0.92} />
      <text x={x} y={y + oy} textAnchor="middle" fill="hsl(var(--foreground))"
        fontSize={9.5} opacity={0.8} fontFamily="sans-serif" letterSpacing="0.07em">{text}</text>
    </g>
  )
}

// ── Main component
export const RouteMap = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const ph = useMemo(getPhase, [])
  const frac = useMemo(getFrac, [])

  const completedPath = useMemo(() => smooth(COMPLETED, 0.5), [])
  const inProgressPath = useMemo(() => {
    if (ph === 'before_progress') return ''
    if (ph === 'in_progress') return smooth(clip(IN_PROGRESS, frac), 0.5)
    return smooth(IN_PROGRESS, 0.5)
  }, [ph, frac])
  const plannedPath = useMemo(() => polyline(PLANNED), [])
  const futurePath  = useMemo(() => polyline(FUTURE), [])
  const icelandPath = useMemo(() => smooth(ICELAND, 0.5), [])

  const activeDot = useMemo((): [number,number] => {
    if (ph === 'before_progress') return [506.9, 502.8]
    if (ph === 'in_progress') return interp(IN_PROGRESS, frac)
    return [561.8, 536.0]
  }, [ph, frac])

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none">

        {/* Iceland inset */}
        <rect x={14} y={9} width={158} height={88} rx={4}
          fill="hsl(var(--background))" fillOpacity={0.6}
          stroke="hsl(var(--foreground))" strokeWidth={0.5} strokeOpacity={0.2} />
        <motion.path d={icelandPath}
          stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeLinecap="round" opacity={0.4}
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }} />
        {ph === 'iceland'
          ? <Pulse x={REYKJAVIK[0]} y={REYKJAVIK[1]} />
          : <Dot x={REYKJAVIK[0]} y={REYKJAVIK[1]} r={2.5} />}
        <text x={92} y={100} textAnchor="middle" fill="hsl(var(--foreground))"
          fontSize={7.5} fontFamily="sans-serif" letterSpacing="0.1em" opacity={0.4}>
          ICELAND 2027
        </text>

        {/* Future route — very faint dotted */}
        {isInView && (
          <motion.path d={futurePath}
            stroke="hsl(var(--foreground))" strokeWidth={1} strokeLinecap="round"
            strokeDasharray="2 7" opacity={0.18}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 3.0 }} />
        )}

        {/* Planned route — dashed */}
        {isInView && (
          <motion.path d={plannedPath}
            stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeLinecap="round"
            strokeDasharray="5 5" opacity={0.35}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 2.4 }} />
        )}

        {/* In-progress — accent colour */}
        {isInView && inProgressPath && (
          <motion.path d={inProgressPath}
            stroke="hsl(var(--accent))" strokeWidth={2.5} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 2.0 }} />
        )}

        {/* Completed route */}
        {isInView && (
          <motion.path d={completedPath}
            stroke="hsl(var(--foreground))" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.4 }} />
        )}

        {/* Knokke */}
        <motion.g initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.2 }}>
          <Dot x={316.2} y={396.7} r={4} />
          <Label x={316.2} y={396.7} text="KNOKKE" above />
        </motion.g>

        {/* Active position */}
        <motion.g initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.3 }}>
          <Pulse x={activeDot[0]} y={activeDot[1]} />
          <Label x={activeDot[0]} y={activeDot[1]} text="WE ARE HERE" above />
        </motion.g>

        {/* Volos */}
        {(ph === 'between' || ph === 'iceland' || ph === 'post_iceland') && (
          <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.5 }}>
            <Dot x={561.8} y={536.0} r={3} />
            <Label x={561.8} y={536.0} text="VOLOS NOV '26" above={false} />
          </motion.g>
        )}

        {/* Istanbul */}
        <motion.g initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
          <Dot x={637.1} y={518.4} r={3} />
          <Label x={637.1} y={518.4} text="ISTANBUL" above />
        </motion.g>

        {/* Nordkapp */}
        <motion.g initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 3.2 }}>
          <circle cx={597.2} cy={48.3} r={2.5} fill="hsl(var(--foreground))" opacity={0.2} />
          <text x={597.2} y={40} textAnchor="middle" fill="hsl(var(--foreground))"
            fontSize={7.5} opacity={0.25} fontFamily="sans-serif" letterSpacing="0.08em">
            NORWAY →
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
