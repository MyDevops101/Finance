"use client";

import { useMemo, useState } from "react";
import { Plus, WalletCards } from "lucide-react";

import { AllocationChart } from "@/components/charts/allocation-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculatePortfolioBeta, calculatePortfolioCost, calculatePortfolioValue, getSectorAllocation } from "@/lib/analytics";
import type { PortfolioHolding } from "@/lib/types";
import { formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export function PortfolioWorkspace({ initialHoldings }: { initialHoldings: PortfolioHolding[] }) {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [symbol, setSymbol] = useState("");

  const value = useMemo(() => calculatePortfolioValue(holdings), [holdings]);
  const cost = useMemo(() => calculatePortfolioCost(holdings), [holdings]);
  const beta = useMemo(() => calculatePortfolioBeta(holdings), [holdings]);
  const allocation = useMemo(() => getSectorAllocation(holdings), [holdings]);

  function addHolding() {
    if (!symbol.trim()) return;
    setHoldings((current) => [
      ...current,
      {
        symbol: symbol.trim().toUpperCase(),
        name: `${symbol.trim().toUpperCase()} Holding`,
        sector: "Watchlist",
        shares: 10,
        avgCost: 100,
        lastPrice: 104,
        dayChangePct: 0.4,
        beta: 1
      }
    ]);
    setSymbol("");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <PortfolioStat label="Portfolio value" value={formatCurrency(value, 0)} />
        <PortfolioStat label="Unrealized P/L" value={formatCurrency(value - cost, 0)} tone={value >= cost ? "success" : "danger"} />
        <PortfolioStat label="Return" value={formatPercent(((value - cost) / cost) * 100)} tone={value >= cost ? "success" : "danger"} />
        <PortfolioStat label="Weighted beta" value={beta.toFixed(2)} tone="primary" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Holdings</CardTitle>
              <div className="flex gap-2">
                <Input
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  placeholder="Add ticker"
                  className="w-36"
                />
                <Button onClick={addHolding} size="icon" aria-label="Add holding">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="scrollbar-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Avg Cost</TableHead>
                    <TableHead className="text-right">Last</TableHead>
                    <TableHead className="text-right">Day</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={holding.symbol}>
                      <TableCell className="font-semibold text-primary">{holding.symbol}</TableCell>
                      <TableCell className="min-w-44">{holding.name}</TableCell>
                      <TableCell>
                        <Badge variant="muted">{holding.sector}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{holding.shares}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.avgCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.lastPrice)}</TableCell>
                      <TableCell className={`text-right font-semibold ${getChangeClass(holding.dayChangePct)}`}>
                        {formatPercent(holding.dayChangePct)}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.shares * holding.lastPrice, 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <AllocationChart data={allocation} />
            </div>
            <div className="mt-4 space-y-2">
              {allocation.map((item) => (
                <div key={item.sector} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
                  <span>{item.sector}</span>
                  <span className="font-semibold text-primary">{item.weight.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-primary" aria-hidden="true" />
            <CardTitle>Correlation Matrix</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-4">
            {holdings.slice(0, 4).map((row, rowIndex) =>
              holdings.slice(0, 4).map((col, colIndex) => {
                const valueCell = rowIndex === colIndex ? 1 : 0.28 + ((rowIndex + colIndex) % 5) * 0.11;
                return (
                  <div key={`${row.symbol}-${col.symbol}`} className="rounded-md border border-border bg-white/5 p-3 text-center">
                    <div className="text-xs text-muted">
                      {row.symbol}/{col.symbol}
                    </div>
                    <div className="mt-1 text-lg font-bold text-primary">{valueCell.toFixed(2)}</div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PortfolioStat({ label, value, tone = "foreground" }: { label: string; value: string; tone?: "foreground" | "success" | "danger" | "primary" }) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : tone === "primary" ? "text-primary" : "text-white";

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted">{label}</p>
        <p className={`mt-1 text-xl font-bold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
