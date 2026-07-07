import type { Metadata } from "next";

import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { SectionHeading } from "@/components/market/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCongressTrades } from "@/lib/api-clients";
import { congressionalFlowSeries } from "@/lib/mock-data";
import { formatPercent, getChangeClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Congressional Trading Tracker",
  description: "Track House and Senate financial disclosures by politician, sector, trade size, and asset."
};

export default async function CongressPage() {
  const trades = await getCongressTrades();

  return (
    <div>
      <SectionHeading
        eyebrow="Public disclosures"
        title="Congressional Trading Tracker"
        description="Track senators, representatives, assets, sectors, disclosed trade sizes, dates, and estimated gains."
      />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Purchase and Sale Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <TimeSeriesChart data={congressionalFlowSeries} primaryLabel="Purchases" secondaryLabel="Sales" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Disclosures</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="scrollbar-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Politician</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Est. gain</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={`${trade.politician}-${trade.symbol}-${trade.disclosedDate}`}>
                      <TableCell>
                        <div className="font-semibold text-white">{trade.politician}</div>
                        <div className="text-xs text-muted">
                          {trade.chamber} - {trade.party}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{trade.asset}</div>
                        <div className="text-xs text-primary">{trade.symbol}</div>
                      </TableCell>
                      <TableCell>{trade.sector}</TableCell>
                      <TableCell>
                        <Badge variant={trade.tradeType === "Purchase" ? "success" : "danger"}>{trade.tradeType}</Badge>
                      </TableCell>
                      <TableCell>{trade.size}</TableCell>
                      <TableCell className={`text-right font-semibold ${getChangeClass(trade.estimatedGainPct)}`}>
                        {formatPercent(trade.estimatedGainPct)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
