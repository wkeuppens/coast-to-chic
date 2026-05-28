import { cn } from '@/lib/utils';

interface DataPopoverProps {
  open: boolean;
  x: number;
  y: number;
  data: {
    stageNumber: number | string;
    region: string;
    distance: string;
    coordinates?: string;
  } | null;
  className?: string;
}

/**
 * Monospace hover popover for stage nodes.
 * No rounded corners, no shadow — single hairline border.
 */
export const DataPopover = ({ open, x, y, data, className }: DataPopoverProps) => {
  if (!open || !data) return null;
  return (
    <div
      className={cn(
        'pointer-events-none fixed z-50 bg-background border border-foreground/80 px-3 py-2 text-index whitespace-nowrap',
        className,
      )}
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className="text-foreground">№ {String(data.stageNumber).padStart(3, '0')} · {data.region}</div>
      <div className="text-muted-foreground">{data.distance}{data.coordinates ? ` · ${data.coordinates}` : ''}</div>
    </div>
  );
};
