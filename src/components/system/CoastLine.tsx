import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DataPopover } from './DataPopover';

export interface CoastNode {
  stageNumber: number;
  region: string;
  distance: string;
  coordinates?: string;
  href?: string;
  active?: boolean;
}

interface CoastLineProps {
  nodes: CoastNode[];
  className?: string;
  /** Height of the strip in px. Default 96. */
  height?: number;
  /** Show wordmark + rule above the line. */
  wordmark?: boolean;
}

/**
 * The persistent hairline of the system.
 * Bleeds off both edges. Horizontal scroll scrubs the coast.
 * Nodes are bullseye markers. Hover → DataPopover. Click → route.
 *
 * ALT: could be implemented as a fixed-position scrubber with transform translate
 * instead of native horizontal scroll. Native scroll chosen for accessibility.
 */
export const CoastLine = ({ nodes, className, height = 96, wordmark = false }: CoastLineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hover, setHover] = useState<{ x: number; y: number; node: CoastNode | null }>({
    x: 0, y: 0, node: null,
  });

  // Convert vertical wheel to horizontal scroll inside the strip
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Spacing between nodes — scaled so 168 stages reads as a long coast
  const nodeGap = 56;
  const totalWidth = Math.max(nodes.length * nodeGap + 200, 1200);

  return (
    <div className={cn('relative w-full select-none', className)}>
      {wordmark && (
        <div className="px-page mb-4 flex items-baseline gap-6">
          <span className="text-index uppercase tracking-[0.16em]">Follow the Coast</span>
          <span className="flex-1 border-t border-foreground/30" />
          <span className="text-index-sm text-muted-foreground">SYS · 001</span>
        </div>
      )}

      <div
        ref={scrollRef}
        className="relative overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ height }}
        role="region"
        aria-label="Coastline scrubber"
      >
        <svg
          width={totalWidth}
          height={height}
          className="block"
          aria-hidden="true"
        >
          {/* The hairline */}
          <line
            x1={0}
            x2={totalWidth}
            y1={height / 2}
            y2={height / 2}
            stroke="hsl(var(--foreground) / 0.45)"
            strokeWidth={1}
          />
        </svg>

        {/* Nodes positioned absolutely over the SVG */}
        <div className="absolute inset-0" style={{ width: totalWidth, height }}>
          {nodes.map((n, i) => {
            const left = 100 + i * nodeGap;
            const top = height / 2;
            const size = 9;
            return (
              <button
                key={n.stageNumber}
                type="button"
                className="absolute group focus:outline-none"
                style={{ left, top, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={(e) => setHover({ x: e.clientX, y: e.clientY, node: n })}
                onMouseMove={(e) => setHover((h) => ({ ...h, x: e.clientX, y: e.clientY }))}
                onMouseLeave={() => setHover({ x: 0, y: 0, node: null })}
                onClick={() => n.href && navigate(n.href)}
                aria-label={`Stage ${n.stageNumber} — ${n.region}`}
              >
                <span
                  className={cn(
                    'block rounded-full border transition-colors duration-200',
                    n.active
                      ? 'bg-accent border-accent'
                      : 'bg-background border-foreground/70 group-hover:border-foreground',
                  )}
                  style={{ width: size, height: size }}
                />
                {/* Stage number under every 10th node */}
                {n.stageNumber % 10 === 0 && (
                  <span className="absolute left-1/2 -translate-x-1/2 top-4 text-index-sm text-muted-foreground">
                    {String(n.stageNumber).padStart(3, '0')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <DataPopover
        open={!!hover.node}
        x={hover.x}
        y={hover.y}
        data={hover.node && {
          stageNumber: hover.node.stageNumber,
          region: hover.node.region,
          distance: hover.node.distance,
          coordinates: hover.node.coordinates,
        }}
      />
    </div>
  );
};
