import { cn } from "@/lib/utils";

/** A labelled group inside a section of the Components page. */
export function Group({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-space-12", className)}>
      <p className="text-subheading-2xs uppercase text-text-soft-400">{label}</p>
      {children}
    </div>
  );
}

/** One item with a small caption under it. */
export function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-space-6">
      {children}
      <span className="text-paragraph-xs text-text-soft-400">{label}</span>
    </div>
  );
}
