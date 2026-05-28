import { cn } from '@/lib/utils';

interface EdgePinProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

/**
 * Crops oversized type against the viewport edge.
 * Used for stage numbers, prev/next navigation, like the Instagram crops.
 */
export const EdgePin = ({ children, side = 'left', className }: EdgePinProps) => {
  return (
    <div
      className={cn(
        'pointer-events-none select-none overflow-hidden',
        side === 'left' ? 'pl-0 -ml-[8vw]' : 'pr-0 -mr-[8vw] text-right',
        className,
      )}
      // ALT: could use viewport-fixed positioning instead of negative margin
    >
      {children}
    </div>
  );
};
