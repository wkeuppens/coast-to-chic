/**
 * Interactive Route Map — Easter egg
 * Reached by clicking the Europe outline on the homepage.
 * Same exact outline as homepage. Hover completed segments to explore stages.
 */
import { useState, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { STAGES } from '@/data/stages';

const COMPLETED = STAGES.filter(s => s.status === 'Completed');

// Ireland + Britain context (same as homepage)
const COAST = [
  `M 197.5 363.0 C 198.0 365.4 201.4 367.4 199.6 372.8 C 197.8 378.2 198.0 379.8 190.1 384.7 C 182.2 389.6 177.9 391.1 168.0 392.5 C 158.1 393.9 152.2 394.4 150.3 390.5 C 148.4 386.6 159.5 383.6 160.4 376.7 C 161.3 369.8 151.3 369.0 153.9 362.8 C 156.5 356.6 164.3 356.2 170.9 351.9 C 177.5 347.5 175.3 347.2 180.3 345.4 C 185.3 343.6 184.8 342.8 190.8 344.8 C 196.8 346.8 202.5 348.9 204.2 353.5 C 205.9 358.1 199.2 360.6 197.5 363.0`,
  `M 222.4 294.6 C 226.2 294.3 237.0 289.5 237.4 293.3 C 237.8 297.1 224.2 306.3 224.1 309.9 C 223.9 313.5 230.2 308.3 236.8 307.8 C 243.4 307.3 247.9 304.8 250.5 307.9 C 253.1 311.0 250.9 313.8 247.3 320.1 C 243.7 326.5 235.6 329.8 236.0 333.3 C 236.4 336.8 242.6 329.4 248.9 334.2 C 255.2 339.0 255.9 347.4 261.1 352.5 C 266.3 357.6 265.6 350.2 269.6 354.7 C 273.7 359.2 274.5 365.1 277.3 370.4 C 280.1 375.7 276.2 373.8 280.9 375.8 C 285.6 377.8 292.6 375.5 296.0 378.3 C 299.4 381.1 296.5 383.8 294.5 386.9 C 292.5 390.0 288.5 388.0 288.1 390.7 C 287.8 393.4 294.7 394.1 293.1 397.5 C 291.6 400.9 288.9 402.5 281.9 404.2 C 274.9 405.9 274.7 403.2 265.2 404.1 C 255.7 405.0 250.7 407.4 243.9 407.6 C 237.1 407.9 241.5 404.2 238.0 405.1 C 234.5 406.0 234.8 410.0 229.8 411.1 C 224.9 412.2 223.3 408.9 218.2 409.7 C 213.1 410.5 213.2 413.9 209.4 414.5 C 205.6 415.1 199.9 416.0 202.8 412.0 C 205.7 408.0 213.7 402.6 221.1 398.5 C 228.5 394.4 234.4 396.9 232.3 395.7 C 230.2 394.4 218.5 395.4 212.7 393.5 C 206.9 391.6 206.8 390.6 209.2 388.3 C 211.6 386.0 220.6 387.0 222.2 384.2 C 223.8 381.4 216.5 381.0 215.4 377.0 C 214.3 373.0 212.6 370.0 217.8 368.1 C 223.0 366.2 231.2 371.1 236.3 369.4 C 241.4 367.7 239.9 365.6 238.2 361.4 C 236.5 357.2 235.5 355.4 229.6 352.6 C 223.7 349.8 218.9 351.8 214.4 350.2 C 209.9 348.6 211.1 348.9 211.5 346.3 C 211.9 343.8 215.9 342.6 216.0 340.0 C 216.1 337.4 214.6 335.3 211.9 336.0 C 209.2 336.7 207.1 344.6 205.2 342.8 C 203.3 341.0 206.2 334.2 204.4 328.9 C 202.6 323.5 198.5 327.2 198.1 321.4 C 197.7 315.6 199.1 312.8 202.7 305.8 C 206.3 298.8 207.5 296.1 212.4 293.3 C 217.3 290.5 219.9 294.3 222.4 294.6`
]

// The completed FTC route — exact same path as homepage SEG3, reversed Knokke→Croatia
// 116 bezier endpoint coords extracted from the Natural Earth path
const ROUTE_PTS: [number,number][] = [
  [316.4,396.7],
  [306.4,399.3],
  [295.5,401.9],
  [291.7,412.4],
  [262.6,422.2],
  [250.8,416.8],
  [254.8,430.9],
  [233.8,427.7],
  [217.6,430.4],
  [218.9,439.3],
  [238.0,443.9],
  [247.2,450.0],
  [260.1,462.4],
  [257.7,485.3],
  [251.2,492.0],
  [231.0,491.6],
  [220.7,492.2],
  [207.4,490.3],
  [190.6,490.4],
  [175.3,488.3],
  [157.6,496.4],
  [162.7,501.2],
  [162.1,509.0],
  [162.6,512.7],
  [165.1,516.6],
  [165.4,521.1],
  [162.8,527.5],
  [161.9,531.8],
  [156.9,535.6],
  [155.9,542.5],
  [158.9,546.4],
  [164.5,547.4],
  [165.7,553.7],
  [163.8,561.7],
  [170.2,560.6],
  [176.8,562.0],
  [181.8,559.4],
  [193.5,560.9],
  [197.0,566.7],
  [201.7,570.1],
  [207.8,571.0],
  [212.6,567.2],
  [220.4,563.6],
  [232.3,563.8],
  [248.2,563.7],
  [257.0,555.8],
  [266.5,553.8],
  [269.2,547.1],
  [276.4,542.5],
  [271.5,536.5],
  [276.3,527.9],
  [284.0,522.0],
  [285.1,518.4],
  [301.1,516.1],
  [313.0,508.9],
  [312.3,502.5],
  [313.8,495.9],
  [332.0,492.2],
  [356.6,495.3],
  [367.9,489.0],
  [373.1,488.1],
  [380.4,482.9],
  [386.1,481.4],
  [396.3,485.1],
  [402.5,486.4],
  [406.4,497.5],
  [414.9,503.8],
  [426.3,510.9],
  [436.1,515.8],
  [445.3,516.5],
  [450.8,520.8],
  [458.8,522.8],
  [462.5,527.4],
  [467.7,528.7],
  [471.5,534.0],
  [476.4,540.1],
  [473.6,542.3],
  [471.1,547.9],
  [471.1,551.1],
  [476.3,550.3],
  [482.9,541.4],
  [488.2,540.8],
  [489.6,535.3],
  [480.6,531.4],
  [485.9,524.5],
  [496.7,526.3],
  [503.7,531.2],
  [506.0,527.4],
  [504.7,525.4],
  [494.0,519.9],
  [484.8,516.6],
  [473.6,512.7],
  [477.1,510.5],
  [474.1,508.1],
  [464.3,508.2],
  [450.4,499.3],
  [444.1,490.1],
  [432.4,484.5],
  [428.3,478.7],
  [429.8,475.4],
  [429.1,469.7],
  [439.3,465.6],
  [449.2,467.3],
  [446.4,468.4],
  [446.0,468.5],
  [445.7,472.6],
  [449.4,476.4],
  [453.2,471.4],
  [461.3,473.3],
  [461.5,477.1],
  [467.2,481.9],
  [464.7,482.8],
  [475.2,491.0],
  [486.6,494.4],
  [493.9,498.4],
  [505.6,502.4]
] as [number,number][]

// Istanbul→Volos (planned, same as homepage SEG1)
const SEG1 = `M 635.1 518.0 C 630.8 518.8 625.2 517.5 620.2 518.5 C 615.2 519.5 618.8 519.6 614.9 521.9 C 611.0 524.2 608.1 527.4 604.5 527.6 C 600.9 527.8 601.5 524.4 600.5 522.6 C 599.5 520.8 602.6 521.0 600.7 520.4 C 598.9 519.8 596.6 520.4 593.1 520.1 C 589.6 519.8 592.0 518.7 586.6 519.1 C 581.2 519.5 573.0 519.7 571.4 521.9 C 569.8 524.1 579.5 526.0 580.1 527.9 C 580.7 529.8 577.0 529.2 573.7 529.6 C 570.4 530.0 570.2 531.0 566.8 529.6 C 563.4 528.2 562.5 525.0 560.2 524.2 C 558.0 523.4 557.7 524.4 557.8 526.5 C 557.9 528.6 558.3 530.0 560.6 532.8`

// Knokke→Grense Jakobselv (future, same as homepage SEG4)
const SEG4 = `M 316.4 396.7 C 320.5 395.2 318.5 399.0 322.9 393.2 C 327.2 387.4 326.8 379.9 333.8 373.6 C 340.8 367.3 344.0 369.2 350.9 367.9 C 357.8 366.6 358.1 368.9 361.3 368.3 C 364.5 367.7 360.6 366.3 363.8 365.4 C 367.0 364.5 371.0 364.1 374.2 364.7 C 377.4 365.3 373.8 368.6 376.5 367.7 C 379.2 366.8 383.6 363.9 385.0 360.9 C 386.4 357.9 383.0 359.0 382.2 355.7 C 381.4 352.4 383.0 351.7 381.6 347.7 C 380.2 343.7 377.9 345.5 376.5 339.8 C 375.1 334.1 375.7 329.7 376.1 325.0 C 376.5 320.3 376.8 323.1 378.2 321.0 C 379.6 318.9 378.1 317.9 381.8 316.5 C 385.5 315.1 389.0 316.9 392.8 315.6 C 396.6 314.4 393.6 313.6 397.2 311.5 C 400.8 309.4 404.9 306.3 407.3 307.2 C 409.7 308.1 407.9 311.9 406.8 315.0 C 405.8 318.1 403.7 317.6 403.1 319.8 C 402.6 322.1 402.5 322.4 404.6 324.0 C 406.7 325.6 410.5 324.3 411.4 326.2 C 412.3 328.1 410.0 330.7 408.3 331.7 C 406.6 332.7 407.8 327.9 404.6 330.1 C 401.4 332.3 397.0 336.1 395.6 340.5 C 394.2 344.9 398.1 344.4 399.0 347.5 C 399.9 350.6 396.0 350.7 399.2 352.9 C 402.4 355.1 408.8 354.1 411.9 356.2 C 415.0 358.2 408.5 360.5 411.7 361.1 C 414.9 361.7 419.6 360.1 424.5 358.5 C 429.4 356.9 426.2 354.3 431.5 354.7 C 436.8 355.1 440.6 357.8 445.6 360.2 C 450.6 362.6 447.9 364.4 451.5 364.5 C 455.1 364.6 453.0 363.1 460.0 360.5 C 467.0 357.9 470.7 356.9 479.5 354.1 C 488.3 351.3 488.2 349.9 495.3 349.3 C 502.4 348.7 504.5 350.2 507.8 351.7 C 511.1 353.1 505.4 354.2 508.7 355.1 C 511.9 356.0 517.1 356.8 520.8 355.3 C 524.5 353.8 518.6 351.8 523.6 349.1 C 528.6 346.4 537.2 348.7 540.9 344.5 C 544.5 340.3 538.8 338.2 538.2 332.4 C 537.6 326.6 537.0 326.5 538.6 321.4 C 540.2 316.3 540.3 315.6 544.8 312.0 C 549.3 308.4 551.2 305.3 556.6 306.8 C 562.0 308.3 561.5 315.4 566.5 318.1 C 571.5 320.9 573.4 320.8 576.5 317.8 C 579.6 314.8 577.9 311.4 578.9 306.2 C 579.9 301.0 581.2 299.0 580.4 297.2 C 579.6 295.4 578.9 300.0 575.8 299.1 C 572.6 298.2 570.1 297.2 567.8 293.6 C 565.5 290.0 563.0 288.0 566.7 284.6 C 570.4 281.2 574.7 281.8 582.6 280.1 C 590.5 278.4 591.0 277.7 598.3 277.8 C 605.6 277.9 605.3 279.9 611.9 280.5 C 618.5 281.1 618.0 282.4 624.8 280.0 C 631.6 277.6 638.7 275.3 639.0 271.1 C 639.3 266.9 634.8 264.9 625.9 263.3 C 617.0 261.7 614.4 262.8 603.2 264.6 C 592.0 266.4 591.8 268.2 581.2 270.6 C 570.6 273.0 567.8 275.4 560.9 274.0 C 554.0 272.6 558.5 268.7 553.6 265.1 C 548.8 261.5 543.8 265.2 541.5 259.7 C 539.2 254.2 545.1 251.2 544.3 243.1 C 543.5 235.0 538.2 233.9 538.2 227.4 C 538.2 220.9 539.9 222.6 544.2 217.1 C 548.5 211.6 545.5 213.5 555.5 205.6 C 565.5 197.7 574.9 191.4 584.1 185.3 C 593.4 179.2 590.7 184.4 592.5 181.3 C 594.3 178.2 595.9 177.4 591.2 173.0 C 586.5 168.6 583.5 164.6 573.8 163.7 C 564.1 162.8 560.7 164.5 552.3 169.3 C 543.9 174.1 542.8 176.6 540.2 182.9 C 537.7 189.2 546.6 187.9 542.1 194.5 C 537.6 201.1 533.2 201.8 522.2 209.4 C 511.2 217.0 506.4 214.9 498.1 224.9 C 489.8 234.9 489.1 240.2 489.0 249.3 C 488.9 258.4 492.7 255.9 497.9 261.1 C 503.1 266.3 509.7 263.4 509.8 270.2 C 509.9 277.0 504.5 282.9 498.4 288.3 C 492.3 293.7 489.8 284.6 485.4 291.9 C 480.9 299.2 483.6 307.7 480.6 317.6 C 477.6 327.5 479.1 328.3 473.5 331.4 C 467.9 334.5 463.9 327.5 458.3 330.0 C 452.8 332.5 456.7 338.4 451.3 341.4 C 445.9 344.4 441.4 345.4 436.8 342.1 C 432.2 338.9 436.4 336.0 432.8 328.4 C 429.2 320.8 427.3 321.2 422.3 311.6 C 417.3 302.0 417.2 297.7 412.8 289.8 C 408.4 281.9 412.8 278.0 404.5 280.1 C 396.2 282.2 390.1 292.8 379.8 298.2 C 369.5 303.6 371.6 302.9 363.1 301.9 C 354.6 300.8 351.2 300.2 345.8 294.0 C 340.4 287.8 343.5 290.9 341.4 277.0 C 339.3 263.1 335.5 250.9 337.4 238.5 C 339.3 226.1 337.8 233.9 348.9 227.3 C 360.0 220.8 367.5 220.8 381.9 212.3 C 396.3 203.8 394.7 204.7 406.6 193.2 C 418.5 181.7 416.3 182.9 429.5 166.2 C 442.7 149.5 446.8 140.4 459.5 126.3 C 472.2 112.2 466.6 121.2 480.4 109.9 C 494.2 98.6 499.3 91.0 514.8 81.2 C 530.2 71.4 530.2 73.1 542.2 70.8 C 554.2 68.5 552.9 76.8 562.8 72.1 C 572.7 67.3 571.3 56.6 581.8 51.8 C 592.2 47.0 593.3 53.9 604.6 52.9`

// Iceland inset (same as homepage)
const ICELAND: [number,number][] = [
  [50.4,74.4],[68.7,82.9],[89.4,82.9],[111.3,76.5],[129.6,65.9],
  [153.9,38.3],[141.7,23.5],[111.3,17.1],[80.9,17.1],[56.5,32.0],
  [32.2,38.3],[26.1,53.2],[38.3,70.2],[50.4,74.4],
]

function smooth(pts: [number,number][], t = 0.5): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length; i++) {
    const p0=pts[i-2]??pts[i-1], p1=pts[i-1], p2=pts[i], p3=pts[i+1]??pts[i]
    const cp1x=p1[0]+(p2[0]-p0[0])*t/2, cp1y=p1[1]+(p2[1]-p0[1])*t/2
    const cp2x=p2[0]-(p3[0]-p1[0])*t/2, cp2y=p2[1]-(p3[1]-p1[1])*t/2
    d.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}

// Split ROUTE_PTS into N proportional slices — one per completed stage
function buildSegments(n: number): [number,number][][] {
  const total = ROUTE_PTS.length
  return Array.from({ length: n }, (_, i) => {
    const start = Math.max(0, Math.round(i * total / n) - 1)
    const end   = Math.min(total, Math.round((i + 1) * total / n) + 1)
    return ROUTE_PTS.slice(start, end)
  })
}

function midpoint(pts: [number,number][]): [number,number] | null {
  if (!pts.length) return null
  return pts[Math.floor(pts.length / 2)]
}

const RouteMapPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const navigate = useNavigate()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const segments  = useMemo(() => buildSegments(COMPLETED.length), [])
  const segPaths  = useMemo(() => segments.map(s => smooth(s)), [segments])
  const icelandPath = useMemo(() => smooth(ICELAND), [])
  const completedPath = useMemo(() => smooth(ROUTE_PTS), [])

  const hoveredStage = hoveredIdx !== null ? COMPLETED[hoveredIdx] : null
  const mid = useMemo(() =>
    hoveredIdx !== null ? midpoint(segments[hoveredIdx]) : null,
    [hoveredIdx, segments]
  )

  const handleClick = useCallback((i: number) => {
    const s = COMPLETED[i]
    if (s) navigate(`/archive?stage=${s.stageNumber}`)
  }, [navigate])

  const FG = 'hsl(var(--foreground))'

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden" style={{ cursor: 'none' }}>
      <SEO title="Route Map" description="Explore the Follow the Coast route, stage by stage." path="/route-map" />

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-6">
        <Link to="/archive"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300">
          <ArrowLeft className="w-3.5 h-3.5" />Archive
        </Link>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">Route Map</span>
      </header>

      <div ref={ref} className="flex items-center justify-center min-h-screen px-8 lg:px-20">
        <div className="w-full max-w-6xl relative">
          {/* Same viewBox and outline as the homepage RouteMap */}
          <svg viewBox="0 15 670 565" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" fill="none">
            <defs>
              <filter id="seg-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                <feFlood floodColor="hsl(var(--accent))" floodOpacity="0.45" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Context: Ireland + Britain — identical to homepage */}
            {COAST.map((d, i) => (
              <path key={i} d={d} stroke={FG} strokeWidth={0.8}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.18} fill="none" />
            ))}

            {/* Future route — same as homepage */}
            {isInView && (
              <motion.path d={SEG4} stroke={FG} strokeWidth={0.8}
                strokeLinecap="round" strokeDasharray="2 7" opacity={0.25} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }} />
            )}

            {/* Planned route — same as homepage */}
            {isInView && (
              <motion.path d={SEG1} stroke={FG} strokeWidth={0.8}
                strokeLinecap="round" strokeDasharray="4 6" opacity={0.18} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.4 }} />
            )}

            {/* Ghost: full completed path, very faint — only when not hovering */}
            <path d={completedPath} stroke={FG}
              strokeWidth={0.8} strokeOpacity={hoveredIdx === null ? 0.18 : 0.06}
              strokeLinecap="round" fill="none"
              style={{ transition: 'stroke-opacity 0.2s' }} />

            {/* Stage segments — highlight on hover */}
            {segPaths.map((d, i) => (
              <path key={`seg-${i}`} d={d}
                stroke={hoveredIdx === i ? 'hsl(var(--accent))' : FG}
                strokeWidth={hoveredIdx === i ? 2.8 : 0.8}
                strokeOpacity={hoveredIdx === null ? 0 : hoveredIdx === i ? 1 : 0.04}
                strokeLinecap="round" strokeLinejoin="round" fill="none"
                filter={hoveredIdx === i ? 'url(#seg-glow)' : undefined}
                style={{ transition: 'stroke-opacity 0.1s, stroke-width 0.1s', pointerEvents: 'none' }} />
            ))}

            {/* Invisible wide hit areas over the completed path */}
            {segPaths.map((d, i) => (
              <path key={`hit-${i}`} d={d}
                stroke="transparent" strokeWidth={24} fill="none"
                style={{ cursor: 'none' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleClick(i)} />
            ))}

            {/* Midpoint dot on hovered stage */}
            {mid && (
              <>
                <circle cx={mid[0]} cy={mid[1]} r={5}
                  fill="hsl(var(--accent))" filter="url(#dot-glow)"
                  style={{ pointerEvents: 'none' }} />
                <circle cx={mid[0]} cy={mid[1]} r={2}
                  fill="hsl(var(--background))"
                  style={{ pointerEvents: 'none' }} />
              </>
            )}

            {/* Iceland inset — identical to homepage */}
            <motion.path d={icelandPath} stroke={FG} strokeWidth={0.8}
              strokeLinecap="round" opacity={0.25} fill="none"
              initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }} />
            <text x={92} y={100} textAnchor="middle" fill={FG}
              fontSize={7.5} fontFamily="sans-serif" letterSpacing="0.1em" opacity={0.35}>
              ICELAND 2027
            </text>

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
  )
}

export default RouteMapPage
