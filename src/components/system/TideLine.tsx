import { cn } from '@/lib/utils';

interface TideLineProps {
  className?: string;
  /** Full-bleed (default) or contained to current container. */
  bleed?: boolean;
  /** Optional label (mono) pinned to one edge of the rule. */
  label?: string;
}

/**
 * The tide line — one horizontal hairline.
 * Separates open space / image from indexed data.
 */
export const TideLine = ({ className, bleed = true, label }: TideLineProps) => {
  return (
    <div
      className={cn(
        'relative w-full',
        bleed ? '-mx-[var(--margin-page)] w-screen max-w-none' : '',
        className,
      )}
    >
      <hr className="rule m-0 border-t border-foreground/20" />
      {label && (
        <span className="absolute right-[var(--margin-page)] -top-3 bg-background px-2 text-index-sm text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
};
