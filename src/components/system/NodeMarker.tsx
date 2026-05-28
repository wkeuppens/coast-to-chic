import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NodeMarkerProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: number;
  label?: string;
}

/**
 * Circular bullseye node.
 * Outlined by default; filled with the accent color only when active.
 * Used on the CoastLine and on the route map.
 */
export const NodeMarker = forwardRef<HTMLButtonElement, NodeMarkerProps>(
  ({ active = false, size = 10, label, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          'relative inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground',
          className,
        )}
        style={{ width: size + 8, height: size + 8 }}
        {...rest}
      >
        <span
          className={cn(
            'block rounded-full border transition-colors duration-200',
            active
              ? 'bg-accent border-accent'
              : 'bg-background border-foreground/70 group-hover:border-foreground',
          )}
          style={{ width: size, height: size }}
        />
        {active && (
          <span
            className="absolute rounded-full border border-accent/40"
            style={{ width: size + 8, height: size + 8 }}
          />
        )}
      </button>
    );
  },
);
NodeMarker.displayName = 'NodeMarker';
