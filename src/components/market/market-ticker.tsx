import { marketIndices } from "@/lib/mock-data";
import { cn, formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export function MarketTicker({ compact = false }: { compact?: boolean }) {
  const items = [...marketIndices, ...marketIndices];

  return (
    <div className={cn("overflow-hidden", compact ? "h-7" : "border-y border-border bg-black py-1.5")}>
      <div className="flex w-max animate-ticker items-center gap-0">
        {items.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex min-w-max items-center gap-2 border-r border-border px-3 py-1 text-[11px]"
          >
            <span className="font-bold uppercase tracking-wide text-primary">{item.symbol}</span>
            <span className="tabular-nums text-foreground">
              {formatCurrency(item.price, item.price > 1000 ? 0 : 2)}
            </span>
            <span className={cn("font-bold tabular-nums", getChangeClass(item.changePct))}>
              {item.changePct >= 0 ? "▲" : "▼"} {formatPercent(item.changePct)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
