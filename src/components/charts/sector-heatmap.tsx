import type { SectorReturn } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";

function getHeat(value: number) {
  if (value > 1) return "border-success/30 bg-success/20 text-success";
  if (value > 0) return "border-success/20 bg-success/10 text-green-200";
  if (value < -1) return "border-danger/30 bg-danger/20 text-danger";
  if (value < 0) return "border-danger/20 bg-danger/10 text-red-200";
  return "border-border bg-white/5 text-muted";
}

export function SectorHeatmap({ data }: { data: SectorReturn[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((sector) => (
        <div key={sector.sector} className={cn("rounded-lg border p-4", getHeat(sector.oneDay))}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-white">{sector.sector}</span>
            <span className="text-lg font-bold">{formatPercent(sector.oneDay)}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-black/[0.18] p-2">
              <div className="text-muted">1W</div>
              <div className="font-semibold">{formatPercent(sector.oneWeek)}</div>
            </div>
            <div className="rounded-md bg-black/[0.18] p-2">
              <div className="text-muted">1M</div>
              <div className="font-semibold">{formatPercent(sector.oneMonth)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
