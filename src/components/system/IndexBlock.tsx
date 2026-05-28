import { cn } from '@/lib/utils';

export interface IndexRow {
  label: string;
  value: string | number;
}

interface IndexBlockProps {
  rows: IndexRow[];
  className?: string;
  /** Optional caption pinned above the rule. */
  caption?: string;
}

/**
 * Two-column mono index table. Thin rule above.
 * Used wherever metadata is shown — stages, books, footer.
 */
export const IndexBlock = ({ rows, className, caption }: IndexBlockProps) => {
  return (
    <div className={cn('w-full', className)}>
      {caption && (
        <p className="text-index-sm text-muted-foreground mb-2">{caption}</p>
      )}
      <hr className="rule m-0 mb-3 border-t border-foreground/30" />
      <dl className="grid grid-cols-[10rem_1fr] gap-y-1.5 text-index">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-muted-foreground uppercase tracking-[0.08em]">
              {r.label}
            </dt>
            <dd className="text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
