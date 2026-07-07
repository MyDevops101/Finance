import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketIndex } from "@/lib/types";
import { cn, formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export function MetricCard({ index }: { index: MarketIndex }) {
  const positive = index.changePct >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("border-l-2", positive ? "border-l-success" : "border-l-danger")}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
              {index.symbol}
            </p>
            <p className="truncate text-[10px] uppercase tracking-wider text-muted">{index.name}</p>
          </div>
          <div className={cn("flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] font-bold", positive ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>
            <Icon className="h-3 w-3" aria-hidden="true" />
            {formatPercent(index.changePct)}
          </div>
        </div>
        <p className={cn("mt-2 text-2xl font-bold tabular-nums", getChangeClass(index.changePct))}>
          {formatCurrency(index.price, index.price > 1000 ? 0 : 2)}
        </p>
        <div className="mt-2 h-10">
          <MiniSparkline data={index.sparkline} positive={positive} />
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-1.5 text-[10px] uppercase tracking-wider text-muted">
          <span>Breadth {index.breadth ?? "--"}%</span>
          <span className={cn("term-blink", positive ? "text-success" : "text-danger")}>● live</span>
        </div>
      </CardContent>
    </Card>
  );
}
