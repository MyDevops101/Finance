import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { Card, CardContent } from "@/components/ui/card";
import { getCommodities } from "@/lib/providers/commodities";
import { cn } from "@/lib/utils";

export async function CommoditiesBoard() {
  const commodities = await getCommodities();

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {commodities.map((c) => {
        const up = c.changePct >= 0;
        return (
          <Card key={c.symbol} className={cn("border-l-2", up ? "border-l-success" : "border-l-danger")}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold uppercase tracking-wider text-primary">{c.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    {c.symbol} · {c.unit}
                  </p>
                </div>
                <span className={cn("text-[11px] font-bold tabular-nums", up ? "text-success" : "text-danger")}>
                  {up ? "▲" : "▼"} {Math.abs(c.changePct).toFixed(2)}%
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                {c.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <div className="mt-2 h-10">
                <MiniSparkline data={c.sparkline} positive={up} />
              </div>
              <div className="mt-1 text-right text-[9px] uppercase tracking-wider text-muted">
                {c.source === "nasdaq" ? "Live · Nasdaq" : "Sim · add key"}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
