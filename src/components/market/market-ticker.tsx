import { marketIndices } from "@/lib/mock-data";
import { cn, formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export function MarketTicker({ compact = false }: { compact?: boolean }) {
  const items = [...marketIndices, ...marketIndices];

  return (
    <div className={cn("overflow-hidden", compact ? "h-8" : "border-y border-border bg-[#080C14]/80 py-2")}>
      <div className="flex w-max animate-ticker items-center gap-4">
        {items.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex min-w-40 items-center justify-between gap-3 rounded-md border border-border bg-white/5 px-3 py-1.5"
          >
            <span className="text-xs font-semibold text-slate-200">{item.symbol}</span>
            <span className="text-xs text-muted">{formatCurrency(item.price, item.price > 1000 ? 0 : 2)}</span>
            <span className={cn("text-xs font-semibold", getChangeClass(item.changePct))}>
              {formatPercent(item.changePct)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
