import type { Metadata } from "next";

import { SectionHeading } from "@/components/market/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { etfs } from "@/lib/mock-data";
import { formatCompact, formatPercent, getChangeClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ETF Dashboard",
  description: "ETF dashboard for assets, categories, expense ratios, yields, returns, and top holdings."
};

export default function EtfsPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="ETF intelligence"
        title="ETF Dashboard"
        description="Compare ETF assets, expense ratios, yields, performance, categories, and top holdings."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {etfs.map((etf) => (
          <Card key={etf.symbol}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{etf.symbol}</CardTitle>
                <Badge variant="muted">{etf.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-white">{etf.name}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Field label="Assets" value={formatCompact(etf.assets)} />
                <Field label="Expense" value={`${etf.expenseRatio.toFixed(2)}%`} />
                <Field label="Yield" value={`${etf.dividendYield.toFixed(2)}%`} />
                <Field label="YTD" value={formatPercent(etf.ytdReturn)} tone={getChangeClass(etf.ytdReturn)} />
              </div>
              <div className="mt-4 space-y-2">
                {etf.holdings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
                    <span>{holding.symbol}</span>
                    <span className="text-muted">{holding.weight.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>ETF Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Assets</TableHead>
                <TableHead className="text-right">Expense</TableHead>
                <TableHead className="text-right">Yield</TableHead>
                <TableHead className="text-right">YTD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etfs.map((etf) => (
                <TableRow key={etf.symbol}>
                  <TableCell className="font-semibold text-primary">{etf.symbol}</TableCell>
                  <TableCell>{etf.name}</TableCell>
                  <TableCell>{etf.category}</TableCell>
                  <TableCell className="text-right">{formatCompact(etf.assets)}</TableCell>
                  <TableCell className="text-right">{etf.expenseRatio.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{etf.dividendYield.toFixed(2)}%</TableCell>
                  <TableCell className={`text-right font-semibold ${getChangeClass(etf.ytdReturn)}`}>
                    {formatPercent(etf.ytdReturn)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-white/5 p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
