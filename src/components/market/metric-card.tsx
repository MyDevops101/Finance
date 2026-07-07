import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketIndex } from "@/lib/types";
import { cn, formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export function MetricCard({ index }: { index: MarketIndex }) {
  const positive = index.changePct >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{index.name}</p>
            <p className="mt-1 text-xl font-semibold">
              {formatCurrency(index.price, index.price > 1000 ? 0 : 2)}
            </p>
          </div>
          <div className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {formatPercent(index.changePct)}
          </div>
        </div>
        <div className="mt-4 h-12">
          <MiniSparkline data={index.sparkline} positive={positive} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>Breadth {index.breadth ?? "--"}%</span>
          <span className={getChangeClass(index.changePct)}>{formatPercent(index.changePct)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
