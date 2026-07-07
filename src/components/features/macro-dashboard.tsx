import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { Card, CardContent } from "@/components/ui/card";
import { getMacroDashboard } from "@/lib/providers/macro";
import { cn } from "@/lib/utils";

export async function MacroDashboard() {
  const indicators = await getMacroDashboard();

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {indicators.map((ind) => {
        const up = ind.change >= 0;
        return (
          <Card key={ind.id}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold uppercase tracking-wider text-primary">{ind.label}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">{ind.id}</p>
                </div>
                <span className={cn("text-[11px] font-bold tabular-nums", up ? "text-success" : "text-danger")}>
                  {up ? "▲" : "▼"} {Math.abs(ind.change).toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                {ind.latest.toFixed(2)}
                <span className="ml-1 text-xs text-muted">{ind.unit}</span>
              </p>
              <div className="mt-2 h-10">
                <MiniSparkline data={ind.series.map((s) => s.value)} positive={up} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
