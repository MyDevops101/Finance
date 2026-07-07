import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-md bg-white/[0.08]", className)}>
      <div
        className="h-full rounded-md bg-primary transition-all"
        style={{ width: `${safeValue}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        role="progressbar"
      />
    </div>
  );
}
