/**
 * Visual pause between sections — like blank pages between chapters.
 * Creates breathing room in the scroll rhythm.
 */
export const ChapterDivider = ({ label }: { label?: string }) => (
  <div className="py-chapter flex items-center justify-center px-page">
    {label ? (
      <span className="text-caption text-muted-foreground">{label}</span>
    ) : (
      <div className="w-8 h-px bg-foreground/15" />
    )}
  </div>
);
