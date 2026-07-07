import type { Metadata } from "next";

import { SectorHeatmap } from "@/components/charts/sector-heatmap";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { DataFeedStatus } from "@/components/features/data-feed-status";
import { FxBoard } from "@/components/features/fx-board";
import { LiveWatchlist } from "@/components/features/live-watchlist";
import { MetricCard } from "@/components/market/metric-card";
import { SectionHeading } from "@/components/market/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMacroChart, getMarketOverview, getNews } from "@/lib/api-clients";
import { sectorReturns } from "@/lib/mock-data";
import { formatPercent, getChangeClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Live market widgets, watchlist, FX, breadth, heatmaps, macro trends, and data-feed status."
};

export default async function DashboardPage() {
  const [indices, macro, news] = await Promise.all([getMarketOverview(), getMacroChart(), getNews()]);

  return (
    <div>
      <SectionHeading
        eyebrow="Command center"
        title="Dashboard"
        description="Live quotes, watchlist, FX board, crypto, breadth, heatmaps, news, and macro risk."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {indices.map((index) => (
          <MetricCard key={index.symbol} index={index} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live Watchlist</CardTitle>
            <span className="text-[10px] uppercase tracking-wider text-muted">Auto-refresh 20s</span>
          </CardHeader>
          <CardContent className="p-0">
            <LiveWatchlist />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>FX Board · Live</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <FxBoard />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Sector Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <SectorHeatmap data={sectorReturns} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Macro Regime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <TimeSeriesChart data={macro} primaryLabel="10Y yield" secondaryLabel="Core CPI" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Market Breadth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {indices.slice(0, 4).map((index) => (
              <div key={index.symbol}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">{index.name}</span>
                  <span className="font-semibold text-primary">{index.breadth}% advancing</span>
                </div>
                <div className="h-2 rounded-md bg-white/[0.08]">
                  <div className="h-full rounded-md bg-primary" style={{ width: `${index.breadth}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market-Moving News</CardTitle>
            <span className="text-[10px] uppercase tracking-wider text-muted">GDELT / NewsAPI</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="scrollbar-thin max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Headline</TableHead>
                    <TableHead className="text-right">Sentiment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.slice(0, 12).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-primary">{item.symbol}</TableCell>
                      <TableCell>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          {item.title}
                        </a>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${getChangeClass(item.sentiment)}`}>
                        {item.sentiment ? formatPercent(item.sentiment * 100) : "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Data Feed Status</CardTitle>
            <span className="text-[10px] uppercase tracking-wider text-muted">Live sources vs. key-required</span>
          </CardHeader>
          <CardContent className="p-3">
            <DataFeedStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
