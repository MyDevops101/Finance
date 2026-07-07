"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, Save, Search } from "lucide-react";

import { saveScreenAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Equity } from "@/lib/types";
import { formatCompact, formatCurrency, formatPercent, getChangeClass, rowsToCsv } from "@/lib/utils";

type SortKey = keyof Pick<
  Equity,
  "marketCap" | "revenueGrowth" | "peRatio" | "dividendYield" | "shortInterest" | "beta" | "quantScore"
>;

export function StockScreener({ stocks }: { stocks: Equity[] }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [country, setCountry] = useState("All");
  const [minMarketCap, setMinMarketCap] = useState(0);
  const [maxPe, setMaxPe] = useState(100);
  const [minRevenueGrowth, setMinRevenueGrowth] = useState(-20);
  const [sortKey, setSortKey] = useState<SortKey>("quantScore");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const sectors = useMemo(() => ["All", ...Array.from(new Set(stocks.map((stock) => stock.sector)))], [stocks]);
  const countries = useMemo(() => ["All", ...Array.from(new Set(stocks.map((stock) => stock.country)))], [stocks]);

  const filtered = useMemo(() => {
    return stocks
      .filter((stock) => {
        const matchesQuery =
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase());
        const matchesSector = sector === "All" || stock.sector === sector;
        const matchesCountry = country === "All" || stock.country === country;
        return (
          matchesQuery &&
          matchesSector &&
          matchesCountry &&
          stock.marketCap >= minMarketCap * 1_000_000_000 &&
          stock.peRatio <= maxPe &&
          stock.revenueGrowth >= minRevenueGrowth
        );
      })
      .sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]));
  }, [country, maxPe, minMarketCap, minRevenueGrowth, query, sector, sortKey, stocks]);

  function exportCsv() {
    const csv = rowsToCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "quiver-screen.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function saveScreen() {
    startTransition(async () => {
      const result = await saveScreenAction({
        name: `Screen ${new Date().toISOString().slice(0, 10)}`,
        filters: {
          query,
          sector,
          country,
          minMarketCap,
          maxPe,
          minRevenueGrowth,
          sortKey
        }
      });
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Equity Screener</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
            <label className="md:col-span-2 xl:col-span-2">
              <span className="mb-1 block text-xs text-muted">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden="true" />
                <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ticker or company" />
              </div>
            </label>
            <label>
              <span className="mb-1 block text-xs text-muted">Sector</span>
              <Select value={sector} onChange={(event) => setSector(event.target.value)}>
                {sectors.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </label>
            <label>
              <span className="mb-1 block text-xs text-muted">Country</span>
              <Select value={country} onChange={(event) => setCountry(event.target.value)}>
                {countries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </label>
            <label>
              <span className="mb-1 block text-xs text-muted">Min cap $B</span>
              <Input type="number" value={minMarketCap} onChange={(event) => setMinMarketCap(Number(event.target.value))} />
            </label>
            <label>
              <span className="mb-1 block text-xs text-muted">Max PE</span>
              <Input type="number" value={maxPe} onChange={(event) => setMaxPe(Number(event.target.value))} />
            </label>
            <label>
              <span className="mb-1 block text-xs text-muted">Sort</span>
              <Select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
                <option value="quantScore">Quant score</option>
                <option value="marketCap">Market cap</option>
                <option value="revenueGrowth">Revenue growth</option>
                <option value="peRatio">PE ratio</option>
                <option value="dividendYield">Dividend yield</option>
                <option value="shortInterest">Short interest</option>
                <option value="beta">Beta</option>
              </Select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex min-w-64 flex-1 items-center gap-3 text-xs text-muted">
              Revenue growth
              <input
                type="range"
                min="-20"
                max="80"
                value={minRevenueGrowth}
                onChange={(event) => setMinRevenueGrowth(Number(event.target.value))}
                className="w-full accent-cyan-300"
              />
              <span className="w-12 text-right text-foreground">{minRevenueGrowth}%</span>
            </label>
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="h-4 w-4" aria-hidden="true" />
              CSV
            </Button>
            <Button onClick={saveScreen} disabled={isPending}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save
            </Button>
          </div>
          {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="scrollbar-thin overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">Rev Growth</TableHead>
                  <TableHead className="text-right">PE</TableHead>
                  <TableHead className="text-right">Dividend</TableHead>
                  <TableHead className="text-right">Short Int.</TableHead>
                  <TableHead className="text-right">Beta</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-semibold text-primary">{stock.symbol}</TableCell>
                    <TableCell className="min-w-52">{stock.name}</TableCell>
                    <TableCell>
                      <Badge variant="muted">{stock.sector}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(stock.price)}</TableCell>
                    <TableCell className={`text-right font-semibold ${getChangeClass(stock.changePct)}`}>
                      {formatPercent(stock.changePct)}
                    </TableCell>
                    <TableCell className="text-right">{formatCompact(stock.marketCap)}</TableCell>
                    <TableCell className={`text-right ${getChangeClass(stock.revenueGrowth)}`}>
                      {formatPercent(stock.revenueGrowth)}
                    </TableCell>
                    <TableCell className="text-right">{stock.peRatio.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{stock.dividendYield.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{stock.shortInterest.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{stock.beta.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{stock.quantScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
