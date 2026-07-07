import type { Metadata } from "next";

import { SectorHeatmap } from "@/components/charts/sector-heatmap";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { MetricCard } from "@/components/market/metric-card";
import { SectionHeading } from "@/components/market/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { macroSeries, marketIndices, newsItems, sectorReturns } from "@/lib/mock-data";
import { formatPercent, getChangeClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Real-time market widgets, breadth, heatmaps, macro trends, and institutional market intelligence."
};

export default function DashboardPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Command center"
        title="Dashboard"
        description="Real-time widgets for major indices, crypto, volatility, breadth, heatmaps, news, and macro risk."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {marketIndices.map((index) => (
          <MetricCard key={index.symbol} index={index} />
        ))}
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
              <TimeSeriesChart data={macroSeries} primaryLabel="10Y yield" secondaryLabel="Core CPI" />
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
            {marketIndices.slice(0, 4).map((index) => (
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
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Headline</TableHead>
                  <TableHead className="text-right">Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-primary">{item.symbol}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell className={`text-right font-semibold ${getChangeClass(item.sentiment)}`}>
                      {formatPercent(item.sentiment * 100)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
