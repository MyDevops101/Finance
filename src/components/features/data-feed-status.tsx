import { getProviderStatus } from "@/lib/providers/status";
import { cn } from "@/lib/utils";

export function DataFeedStatus() {
  const providers = getProviderStatus();
  return (
    <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-2 bg-[#05070a] px-3 py-2">
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-foreground">{p.name}</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-muted">{p.category}</div>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                p.active ? "bg-success term-blink" : "bg-muted"
              )}
            />
            <span className={cn("text-[10px] font-bold uppercase", p.active ? "text-success" : "text-muted")}>
              {p.active ? "Live" : "Key req"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
