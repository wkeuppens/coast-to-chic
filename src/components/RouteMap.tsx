import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

// ── Real Natural Earth coastline paths ───────────────────────────────────────
// Source: ne_110m_coastline.geojson, projected to Mercator 800x600 SVG
// Europe bounding box: lon -25→40, lat 34→72

const COASTLINE_PATHS = [
    'M 231.4 357.9 L 233.4 368.3 L 224.1 381.1 L 202.3 389.4 L 184.9 387.3 L 194.9 372.5 L 188.4 357.7 L 205.2 346.1 L 214.5 339.1 L 224.8 338.5 L 238.0 347.8 L 231.4 357.9',
    'M 713.2 585.4 L 722.1 585.6 L 733.2 582.4 L 724.9 586.9 L 726.2 589.7 L 713.6 594.0 L 707.6 592.7 L 704.7 588.4 L 711.4 588.0 L 713.2 585.4',
    'M 631.3 586.3 L 629.7 589.5 L 612.0 590.4 L 612.1 588.6 L 597.1 586.5 L 599.4 582.0 L 606.1 585.6 L 615.7 585.0 L 624.9 585.8 L 624.6 587.6 L 631.3 586.3',
    'M 414.9 524.7 L 421.0 521.2 L 428.4 529.3 L 426.7 544.2 L 421.1 543.5 L 416.1 547.2 L 411.4 544.3 L 410.9 530.7 L 408.1 524.2 L 414.9 524.7',
    'M 415.3 504.7 L 423.3 500.2 L 425.4 510.3 L 421.3 519.2 L 415.7 516.9 L 412.9 509.1 L 415.3 504.7',
    'M 459.9 324.1 L 463.9 331.8 L 456.5 344.1 L 443.6 335.6 L 441.9 329.2 L 459.9 324.1',
    'M 255.9 285.0 L 270.7 283.6 L 257.6 301.3 L 270.1 299.1 L 283.6 299.2 L 280.4 312.2 L 269.3 326.2 L 282.0 327.2 L 294.0 346.7 L 302.4 349.1 L 310.0 365.8 L 313.5 371.5 L 328.4 374.3 L 326.9 383.3 L 320.6 387.4 L 325.5 394.6 L 314.5 401.8 L 298.0 401.7 L 277.0 405.5 L 271.3 402.8 L 263.2 409.1 L 251.8 407.6 L 243.1 412.8 L 236.6 410.1 L 254.6 395.7 L 265.7 392.7 L 246.3 390.4 L 242.9 384.9 L 255.7 380.5 L 249.0 372.8 L 251.3 363.4 L 269.6 364.7 L 271.4 356.2 L 263.0 346.9 L 248.1 344.2 L 245.1 340.2 L 249.6 333.4 L 245.6 329.2 L 238.9 336.4 L 238.2 321.6 L 232.0 313.6 L 236.5 297.0 L 246.0 283.7 L 255.9 285.0',
    'M 129.1 136.0 L 126.3 149.8 L 140.2 164.0 L 124.2 179.5 L 88.7 193.0 L 78.1 196.5 L 61.9 193.7 L 27.5 187.5 L 39.6 178.7 L 12.9 168.8 L 34.7 164.9 L 34.1 158.8 L 8.3 154.0 L 16.6 140.1 L 35.3 136.9 L 54.4 151.4 L 73.1 139.8 L 88.6 145.9 L 108.7 134.4 L 129.1 136.0',
    'M 489.4 555.6 L 498.7 554.7 L 494.3 563.3 L 496.1 566.7 L 493.5 572.2 L 484.1 568.2 L 477.9 567.0 L 460.7 561.5 L 462.4 555.8 L 476.8 556.8 L 489.4 555.6',
    'M 769.7 480.5 L 783.8 485.0 L 799.4 495.2',
    'M 186.9 629.0 L 191.6 620.2 L 193.2 614.8 L 201.1 607.9 L 213.5 603.2 L 222.6 598.8 L 230.8 588.0 L 234.7 581.4 L 243.8 581.5 L 251.2 586.0 L 262.9 585.3 L 275.6 587.6 L 281.0 587.7 L 292.8 581.9 L 306.1 580.1 L 313.9 575.7 L 325.7 572.4 L 346.6 570.5 L 367.0 569.6 L 373.2 571.2 L 384.8 566.9 L 397.9 566.8 L 402.9 569.4 L 411.3 568.7 L 424.7 564.3 L 433.4 565.6 L 433.0 571.1 L 443.4 567.1 L 444.3 569.2 L 438.2 574.5 L 438.1 579.4 L 442.3 582.1 L 440.7 591.3 L 432.6 596.5 L 434.9 602.2 L 441.3 602.4 L 444.4 607.3 L 449.1 609.0 L 463.5 612.5 L 468.7 611.6 L 479.0 613.3 L 495.3 617.9 L 501.1 627.0 L 512.1 628.9',
    'M 551.6 623.1 L 555.5 618.2 L 564.4 613.4 L 572.8 612.0 L 589.5 614.1 L 593.7 618.7 L 598.3 618.7 L 602.2 620.5 L 614.4 621.6 L 617.4 625.0 L 633.8 624.8 L 645.6 627.5 L 657.9 630.5',
    'M 673.0 628.9 L 678.1 626.0 L 688.9 625.1 L 697.7 626.4',
    'M 729.4 628.5 L 733.0 625.2 L 732.2 624.6 L 735.4 619.9 L 737.9 612.1 L 739.7 609.5 L 740.0 609.4 L 744.4 601.0 L 750.5 593.6 L 750.7 593.2 L 749.6 585.2 L 752.6 580.8 L 748.1 575.9 L 752.7 571.9 L 745.2 572.8 L 734.9 570.3 L 726.5 576.5 L 707.8 577.7 L 697.8 572.0 L 684.6 571.6 L 681.7 576.1 L 673.2 577.3 L 661.3 571.6 L 647.9 571.8 L 640.6 561.0 L 631.6 554.9 L 637.6 546.3 L 629.8 541.0 L 643.4 530.2 L 662.4 529.8 L 667.6 521.1 L 691.0 522.6 L 705.8 515.1 L 720.2 511.8 L 740.5 511.6 L 762.0 519.8 L 779.7 524.2 L 794.0 522.4 L 804.6 523.4 L 819.1 517.4 L 821.0 512.5 L 817.9 504.5 L 810.8 500.2 L 804.0 498.8 L 799.4 495.2 L 783.8 485.0 L 769.7 480.5 L 759.1 473.3 L 768.0 471.3 L 778.3 460.9 L 771.4 456.0 L 789.5 450.8 L 789.2 448.0 L 778.1 450.1 L 768.3 451.1 L 760.1 455.2 L 748.6 455.9 L 738.0 460.5 L 738.7 468.3 L 744.7 471.3 L 757.3 470.5 L 754.9 474.9 L 741.4 477.0 L 724.7 484.0 L 717.9 481.6 L 720.6 475.9 L 707.1 472.3 L 709.3 469.9 L 721.1 465.8 L 717.5 462.9 L 698.4 459.8 L 697.5 455.1 L 686.1 456.6 L 681.6 463.5 L 672.0 472.7 L 672.3 475.9 L 666.4 478.5 L 662.6 477.3 L 659.2 491.9 L 652.8 496.9 L 648.3 505.3 L 652.3 512.0 L 653.7 516.4 L 664.5 520.2 L 662.2 523.0 L 647.6 523.6 L 642.4 527.1 L 632.1 533.3 L 628.2 528.0 L 628.4 525.6 L 620.9 525.3 L 614.5 524.2 L 599.6 527.2 L 608.1 533.6 L 601.8 535.4 L 595.0 535.4 L 588.5 529.6 L 586.2 532.1 L 588.9 538.8 L 595.1 544.1 L 590.4 546.5 L 597.3 551.6 L 603.4 554.8 L 603.6 561.0 L 592.2 558.1 L 595.8 563.7 L 588.0 564.8 L 592.7 574.4 L 584.5 574.5 L 574.4 569.8 L 569.8 561.1 L 567.6 553.8 L 562.8 548.7 L 556.5 542.4 L 555.7 539.2 L 553.6 538.4 L 553.4 535.9 L 546.5 532.1 L 545.5 526.7 L 546.5 518.9 L 548.2 515.3 L 546.1 513.5 L 543.5 512.6 L 540.1 508.8 L 534.8 506.5 L 523.2 502.1 L 516.1 497.8 L 504.8 494.3 L 494.5 485.5 L 496.9 484.6 L 491.3 479.5 L 491.1 475.4 L 483.2 473.4 L 479.4 478.7 L 475.8 474.6 L 476.1 470.3 L 476.5 470.1 L 479.2 469.0 L 469.4 467.2 L 459.4 471.6 L 460.1 477.7 L 458.6 481.2 L 462.6 487.3 L 474.2 493.3 L 480.4 503.1 L 494.1 512.6 L 503.7 512.5 L 506.7 515.1 L 503.3 517.4 L 514.3 521.5 L 523.3 525.0 L 533.9 530.9 L 535.1 533.1 L 532.8 537.1 L 526.0 531.8 L 515.3 530.0 L 510.1 537.3 L 519.0 541.4 L 517.6 547.3 L 512.4 547.9 L 505.9 557.4 L 500.7 558.2 L 500.8 554.9 L 503.3 548.9 L 506.0 546.6 L 501.2 540.1 L 497.4 534.4 L 492.3 533.0 L 488.7 528.1 L 480.7 526.0 L 475.4 521.4 L 466.3 520.7 L 456.7 515.5 L 445.4 507.9 L 437.1 501.1 L 433.2 489.4 L 427.1 488.0 L 417.1 484.0 L 411.4 485.6 L 404.3 491.2 L 399.2 492.1 L 388.1 498.8 L 363.8 495.6 L 345.9 499.4 L 344.4 506.5 L 345.1 513.3 L 333.4 521.0 L 317.7 523.4 L 316.6 527.3 L 309.0 533.6 L 304.3 542.7 L 309.1 549.1 L 301.9 554.0 L 299.3 561.1 L 290.0 563.3 L 281.3 571.6 L 265.7 571.8 L 253.9 571.6 L 246.2 575.4 L 241.5 579.5 L 235.5 578.6 L 230.9 574.9 L 227.4 568.7 L 216.0 567.1 L 211.0 569.9 L 204.5 568.4 L 198.2 569.5 L 200.0 561.0 L 198.9 554.3 L 193.4 553.3 L 190.4 549.1 L 191.4 541.8 L 196.3 537.7 L 197.2 533.2 L 199.8 526.3 L 199.5 521.5 L 197.0 517.4 L 196.5 513.4 L 197.1 505.1 L 192.1 500.0 L 209.5 491.4 L 224.6 493.6 L 241.1 493.5 L 254.2 495.5 L 264.4 494.9 L 284.3 495.3 L 290.7 488.1 L 293.0 463.8 L 280.3 450.6 L 271.2 444.1 L 252.4 439.2 L 251.2 429.7 L 267.1 426.8 L 287.8 430.2 L 283.9 415.2 L 295.5 420.9 L 324.2 410.5 L 327.9 399.4 L 338.6 396.6 L 348.5 393.9 L 354.8 390.0 L 365.6 369.2 L 382.5 363.2 L 392.7 363.6 L 395.1 360.5 L 405.4 359.7 L 407.7 362.9 L 416.0 355.7 L 413.2 350.1 L 412.6 341.7 L 407.6 333.2 L 407.3 317.4 L 409.3 313.2 L 412.8 308.4 L 423.7 307.4 L 428.0 303.0 L 437.9 298.5 L 437.5 306.7 L 433.8 311.9 L 435.3 316.3 L 442.0 318.7 L 439.0 324.6 L 435.3 322.9 L 426.5 334.0 L 429.8 341.4 L 430.0 347.2 L 442.5 350.6 L 442.3 355.9 L 454.8 353.1 L 461.8 349.0 L 475.7 354.9 L 481.5 359.6 L 489.9 355.2 L 509.1 348.4 L 524.6 343.3 L 536.9 345.9 L 537.8 349.5 L 549.7 349.7 L 552.5 343.1 L 569.5 338.2 L 566.8 325.4 L 567.3 313.6 L 573.3 303.6 L 584.9 298.1 L 594.7 310.1 L 604.6 309.8 L 606.9 297.4 L 608.4 287.8 L 603.8 289.9 L 596.0 284.0 L 595.0 274.4 L 610.5 269.6 L 626.0 267.2 L 639.4 270.0 L 652.1 269.5 L 666.1 260.0 L 653.2 251.7 L 630.8 253.1 L 609.2 259.5 L 589.2 263.1 L 582.0 253.7 L 570.1 247.9 L 572.9 230.2 L 566.9 213.5 L 572.8 202.4 L 583.9 190.3 L 612.1 168.6 L 620.3 164.3 L 619.0 155.6 L 601.9 145.6 L 580.7 151.6 L 568.8 166.1 L 570.7 178.5 L 551.1 194.3 L 527.4 210.8 L 518.4 236.8 L 527.2 249.4 L 538.9 259.1 L 527.6 278.3 L 514.8 282.2 L 510.1 309.5 L 503.1 324.2 L 488.2 322.7 L 481.2 334.9 L 467.0 335.6 L 463.1 321.1 L 452.8 303.1 L 443.4 279.9 L 435.2 269.6 L 410.9 288.9 L 394.4 292.8 L 377.4 284.4 L 373.0 266.3 L 369.1 225.3 L 380.5 213.4 L 413.0 197.4 L 437.3 177.0 L 459.8 148.3 L 489.4 105.8 L 510.0 88.3 L 543.8 57.8 L 570.8 46.7 L 591.1 48.0 L 609.8 26.4 L 632.2 27.6 L 654.3 22.3 L 692.8 41.6 L 677.0 48.4 L 690.5 64.2 L 703.2 55.5 L 723.4 70.5 L 757.1 76.3 L 803.6 103.0 L 813.0 113.8 L 813.9 128.7 L 800.2 140.1 L 780.1 145.8 L 725.2 129.4 L 716.1 132.1 L 736.2 147.9 L 737.0 157.6 L 737.8 178.5 L 753.6 184.5 L 763.2 189.6 L 764.8 180.0 L 757.4 171.4 L 765.2 163.7 L 795.0 176.3 L 805.4 171.4 L 797.1 156.3 L 825.8 135.5'
  ]

// ── Route waypoints (pre-projected to SVG space) ─────────────────────────────

const COMPLETED_PTS: [number,number][] = [
  [348.3,393.8],[339.1,397.9],[287.4,430.1],[252.6,433.7],[273.7,443.1],
  [288.6,462.1],[294.5,468.3],[293.2,480.6],[287.0,495.8],[285.8,496.2],
  [271.8,496.8],[204.3,495.8],[193.8,501.7],[200.4,517.9],[195.2,549.3],
  [196.9,568.0],[241.8,577.3],[303.0,561.6],[314.1,529.9],[334.3,519.2],
  [346.5,506.8],[373.5,496.8],[397.2,492.0],[399.0,491.6],[417.6,483.6],
  [429.8,487.8],[437.2,493.8],[446.2,501.5],[458.5,517.3],[479.0,527.9],
  [500.1,558.1],[531.9,529.5],[518.2,523.7],[512.0,516.3],[482.7,522.5],
  [462.5,487.8],[477.2,468.3],[485.5,474.1],[510.0,494.4],[530.5,504.5],
  [536.0,506.8],
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
  [411.7,333.8],[364.6,379.4],[348.3,393.8],
]

const ICELAND_PTS: [number,number][] = [
  [50.4,74.4],[68.7,82.9],[89.4,82.9],[111.3,76.5],[129.6,65.9],
  [153.9,38.3],[141.7,23.5],[111.3,17.1],[80.9,17.1],[56.5,32.0],
  [32.2,38.3],[26.1,53.2],[38.3,70.2],[50.4,74.4],
]
const REYKJAVIK: [number,number] = [51.3, 67.2]

// ── Path builders ─────────────────────────────────────────────────────────────

function polyline(pts: [number,number][]): string {
  if (!pts.length) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

function smooth(pts: [number,number][]): string {
  if (pts.length < 2) return ''
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], curr = pts[i]
    const pp = pts[i - 2] ?? prev, next = pts[i + 1] ?? curr
    const t = 0.15
    const cp1x = prev[0] + (curr[0] - pp[0]) * t
    const cp1y = prev[1] + (curr[1] - pp[1]) * t
    const cp2x = curr[0] - (next[0] - prev[0]) * t
    const cp2y = curr[1] - (next[1] - prev[1]) * t
    d.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${curr[0]} ${curr[1]}`)
  }
  return d.join(' ')
}

// ── Date logic ────────────────────────────────────────────────────────────────

const TODAY = new Date()
const D = {
  inProgressStart: new Date('2026-10-08'),
  inProgressEnd:   new Date('2026-11-23'),
  icelandStart:    new Date('2027-06-12'),
  icelandEnd:      new Date('2027-07-13'),
}

type Phase = 'before_progress' | 'in_progress' | 'between' | 'iceland' | 'post_iceland'

function phase(): Phase {
  if (TODAY < D.inProgressStart) return 'before_progress'
  if (TODAY <= D.inProgressEnd)  return 'in_progress'
  if (TODAY < D.icelandStart)    return 'between'
  if (TODAY <= D.icelandEnd)     return 'iceland'
  return 'post_iceland'
}

function inProgressFrac(): number {
  const t = (TODAY.getTime() - D.inProgressStart.getTime())
  const total = D.inProgressEnd.getTime() - D.inProgressStart.getTime()
  return Math.max(0, Math.min(1, t / total))
}

function interpolate(pts: [number,number][], t: number): [number,number] {
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
      const segT = (target - lens[i-1]) / (lens[i] - lens[i-1])
      return [pts[i-1][0] + segT * (pts[i][0] - pts[i-1][0]), pts[i-1][1] + segT * (pts[i][1] - pts[i-1][1])]
    }
  }
  return pts[pts.length - 1]
}

function clip(pts: [number,number][], t: number): [number,number][] {
  if (t >= 1) return pts
  const pos = interpolate(pts, t)
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

// ── Sub-components ────────────────────────────────────────────────────────────

function Pulse({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={2} />
      <motion.circle cx={x} cy={y} r={6} fill="none" stroke="hsl(var(--accent))" strokeWidth={1.5}
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 3.2, opacity: 0 }}
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
      <text x={x} y={y + oy} textAnchor="middle"
        fill="hsl(var(--foreground))" fontSize={9.5} opacity={0.8}
        fontFamily="sans-serif" letterSpacing="0.07em">
        {text}
      </text>
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export const RouteMap = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const ph = useMemo(phase, [])
  const frac = useMemo(inProgressFrac, [])

  const completedPath  = useMemo(() => smooth(COMPLETED_PTS), [])
  const inProgressPath = useMemo(() => {
    if (ph === 'before_progress') return ''
    if (ph === 'in_progress') return smooth(clip(IN_PROGRESS_PTS, frac))
    return smooth(IN_PROGRESS_PTS)
  }, [ph, frac])
  const plannedPath = useMemo(() => polyline(PLANNED_PTS), [])
  const futurePath  = useMemo(() => polyline(FUTURE_PTS), [])
  const icelandPath = useMemo(() => smooth(ICELAND_PTS), [])

  const activeDot = useMemo((): [number,number] => {
    if (ph === 'before_progress') return [536.0, 506.8]
    if (ph === 'in_progress') return interpolate(IN_PROGRESS_PTS, frac)
    return [590.0, 542.2]
  }, [ph, frac])

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none">

        {/* ── Real European coastline ── */}
        {COASTLINE_PATHS.map((d, i) => (
          <path key={i} d={d}
            stroke="hsl(var(--foreground))" strokeWidth={0.7}
            strokeOpacity={0.12} fill="none" strokeLinecap="round" />
        ))}

        {/* ── Iceland inset ── */}
        <rect x={14} y={9} width={158} height={88} rx={4}
          fill="hsl(var(--background))" fillOpacity={0.6}
          stroke="hsl(var(--foreground))" strokeWidth={0.5} strokeOpacity={0.2} />
        <motion.path d={icelandPath}
          stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeLinecap="round" opacity={0.4}
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }} />
        {ph === 'iceland' ? <Pulse x={REYKJAVIK[0]} y={REYKJAVIK[1]} /> : <Dot x={REYKJAVIK[0]} y={REYKJAVIK[1]} r={2.5} />}
        <text x={92} y={100} textAnchor="middle" fill="hsl(var(--foreground))"
          fontSize={7.5} fontFamily="sans-serif" letterSpacing="0.1em" opacity={0.4}>
          ICELAND 2027
        </text>

        {/* ── Future route (Norway → Belgium) ── */}
        {isInView && (
          <motion.path d={futurePath}
            stroke="hsl(var(--foreground))" strokeWidth={1} strokeLinecap="round"
            strokeDasharray="2 6" opacity={0.18}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 3.0 }} />
        )}

        {/* ── Planned route ── */}
        {isInView && (
          <motion.path d={plannedPath}
            stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeLinecap="round"
            strokeDasharray="5 5" opacity={0.35}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 2.4 }} />
        )}

        {/* ── In-progress route ── */}
        {isInView && inProgressPath && (
          <motion.path d={inProgressPath}
            stroke="hsl(var(--accent))" strokeWidth={2.5} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 2.0 }} />
        )}

        {/* ── Completed route ── */}
        {isInView && (
          <motion.path d={completedPath}
            stroke="hsl(var(--foreground))" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.4 }} />
        )}

        {/* ── Dots & labels ── */}
        <motion.g initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.2 }}>
          <Dot x={348.3} y={393.8} r={4} />
          <Label x={348.3} y={393.8} text="KNOKKE" above />
        </motion.g>

        <motion.g initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.3 }}>
          <Pulse x={activeDot[0]} y={activeDot[1]} />
          <Label x={activeDot[0]} y={activeDot[1]} text="WE ARE HERE" above />
        </motion.g>

        {(ph === 'between' || ph === 'iceland' || ph === 'post_iceland') && (
          <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.5 }}>
            <Dot x={590.0} y={542.2} r={3} />
            <Label x={590.0} y={542.2} text="VOLOS NOV '26" above={false} />
          </motion.g>
        )}

        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
          <Dot x={664.2} y={523.5} r={3} />
          <Label x={664.2} y={523.5} text="ISTANBUL" above />
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 3.2 }}>
          <circle cx={625.0} cy={22.7} r={2.5} fill="hsl(var(--foreground))" opacity={0.2} />
          <text x={625.0} y={14} textAnchor="middle" fill="hsl(var(--foreground))"
            fontSize={7.5} opacity={0.25} fontFamily="sans-serif" letterSpacing="0.08em">
            NORWAY →
          </text>
        </motion.g>

      </svg>
    </div>
  )
}
