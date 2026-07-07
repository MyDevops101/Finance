import type { Metadata } from "next";

import { ChartingTerminal } from "@/components/features/charting-terminal";
import { SectorHeatmap } from "@/components/charts/sector-heatmap";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { SectionHeading } from "@/components/market/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMacroChart, getMarketOverview } from "@/lib/api-clients";
import { sectorReturns } from "@/lib/mock-data";
import { formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Market Overview",
  description: "Global market overview with candlestick charts, technical indicators, breadth, sector rotation, and macro signals."
};

export default async function MarketPage() {
  const [indices, macro] = await Promise.all([getMarketOverview(), getMacroChart()]);

  return (
    <div>
      <SectionHeading
        eyebrow="Market overview"
        title="Cross-Asset Signal Board"
        description="Live index quotes, candlestick charts with technical indicators, sector rotation, and macro trends."
      />
      <div className="grid gap-3 md:grid-cols-3">
        {indices.slice(0, 6).map((index) => (
          <Card key={index.symbol}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">{index.name}</p>
                  <p className="mt-1 text-xl font-bold tabular-nums">{formatCurrency(index.price, index.price > 1000 ? 0 : 2)}</p>
                </div>
                <Badge variant={index.changePct >= 0 ? "success" : "danger"}>{formatPercent(index.changePct)}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-white/5 p-2">
                  <div className="text-muted">Breadth</div>
                  <div className="font-semibold text-primary">{index.breadth ?? "--"}%</div>
                </div>
                <div className="rounded-md bg-white/5 p-2">
                  <div className="text-muted">Volatility</div>
                  <div className={getChangeClass((index.volatility ?? 0) - 20)}>{index.volatility}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Charting Terminal · Candles + Indicators</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartingTerminal initialSymbol="AAPL" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Sector Rotation</CardTitle>
          </CardHeader>
          <CardContent>
            <SectorHeatmap data={sectorReturns} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rates and Inflation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <TimeSeriesChart data={macro} primaryLabel="10Y yield" secondaryLabel="Core CPI" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
