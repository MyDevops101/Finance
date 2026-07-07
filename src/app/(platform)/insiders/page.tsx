import type { Metadata } from "next";

import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { SecFilings } from "@/components/features/sec-filings";
import { SectionHeading } from "@/components/market/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInsiderFilings, getInsiderTrades } from "@/lib/api-clients";
import { congressionalFlowSeries } from "@/lib/mock-data";
import { formatCompact, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insider Trading Tracker",
  description: "Track executive buying and selling from SEC Form 4 filings."
};

export default async function InsidersPage() {
  const [trades, liveFilings] = await Promise.all([getInsiderTrades(), getInsiderFilings()]);
  const buyValue = trades.filter((trade) => trade.side === "Buy").reduce((sum, trade) => sum + trade.value, 0);
  const sellValue = trades.filter((trade) => trade.side === "Sell").reduce((sum, trade) => sum + trade.value, 0);

  return (
    <div>
      <SectionHeading
        eyebrow="SEC Form 4"
        title="Insider Trading Tracker"
        description="Monitor executive name, company, buy or sell direction, shares, value, and filing date."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Insider buys" value={formatCurrency(buyValue, 0)} tone="success" />
        <Stat label="Insider sells" value={formatCurrency(sellValue, 0)} tone="danger" />
        <Stat label="Net signal" value={buyValue > sellValue ? "Accumulation" : "Distribution"} tone="primary" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Buying and Selling Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <TimeSeriesChart data={congressionalFlowSeries} primaryLabel="Buying" secondaryLabel="Selling" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Filings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="scrollbar-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Executive</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Filing date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={`${trade.symbol}-${trade.executive}-${trade.filingDate}`}>
                      <TableCell>
                        <div className="font-semibold text-white">{trade.executive}</div>
                        <div className="text-xs text-muted">{trade.role}</div>
                      </TableCell>
                      <TableCell>
                        <div>{trade.company}</div>
                        <div className="text-xs text-primary">{trade.symbol}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.side === "Buy" ? "success" : "danger"}>{trade.side}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCompact(trade.shares)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(trade.value, 0)}</TableCell>
                      <TableCell>{trade.filingDate}</TableCell>
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
            <CardTitle>Live SEC Form 3/4/5 Filings · EDGAR</CardTitle>
            <span className="text-[10px] uppercase tracking-wider text-muted">Keyless — data.sec.gov</span>
          </CardHeader>
          <CardContent className="p-0">
            <SecFilings filings={liveFilings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "success" | "danger" | "primary" }) {
  const toneClass = tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-primary";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted">{label}</div>
        <div className={`mt-1 text-xl font-bold ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
