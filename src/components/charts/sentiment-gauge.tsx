import { cn } from "@/lib/utils";

export function SentimentGauge({ value, label }: { value: number; label: string }) {
  const normalized = Math.round(((value + 1) / 2) * 100);
  const color = normalized >= 60 ? "text-success" : normalized <= 40 ? "text-danger" : "text-primary";

  return (
    <div className="rounded-lg border border-border bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className={cn("text-sm font-bold", color)}>{normalized}</span>
      </div>
      <div className="mt-4 h-3 rounded-md bg-white/[0.08]">
        <div
          className={cn(
            "h-full rounded-md",
            normalized >= 60 ? "bg-success" : normalized <= 40 ? "bg-danger" : "bg-primary"
          )}
          style={{ width: `${normalized}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>
    </div>
  );
}
