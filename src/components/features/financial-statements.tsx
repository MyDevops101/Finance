"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FinancialStatements as Statements, StatementLine } from "@/lib/providers/fundamentals";
import { formatCompact } from "@/lib/utils";

function fmt(value: number | null, label: string) {
  if (value == null) return "--";
  if (label.startsWith("EPS")) return value.toFixed(2);
  return formatCompact(value);
}

function StatementTable({ periods, lines }: { periods: string[]; lines: StatementLine[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Line item</TableHead>
          {periods.map((p) => (
            <TableHead key={p} className="text-right">
              {p}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((line) => (
          <TableRow key={line.label}>
            <TableCell className="text-muted">{line.label}</TableCell>
            {line.values.map((v, i) => (
              <TableCell key={i} className="text-right tabular-nums text-foreground">
                {fmt(v, line.label)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function FinancialStatements({ initialSymbol = "AAPL" }: { initialSymbol?: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [input, setInput] = useState(initialSymbol);
  const [data, setData] = useState<Statements | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (sym: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fundamentals?symbol=${encodeURIComponent(sym)}`);
      setData((await res.json()) as Statements);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(symbol);
  }, [symbol, load]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSymbol(input.trim().toUpperCase());
  };

  return (
    <div>
      <form onSubmit={submit} className="mb-4 flex items-center gap-1">
        <span className="text-primary">&gt;</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Ticker"
          placeholder="TICKER"
          className="h-8 w-32 border border-border bg-[#0a0c0f] px-2 text-xs uppercase tracking-wider text-foreground outline-none focus:border-primary"
        />
        <Button type="submit" size="sm">
          Load
        </Button>
        {data ? (
          <Badge variant={data.source === "mock" ? "muted" : "success"} className="ml-2">
            {data.source === "mock" ? "Sim · add FMP_API_KEY" : `Live · ${data.source}`}
          </Badge>
        ) : null}
      </form>

      {loading || !data ? (
        <div className="py-10 text-center text-xs text-muted">Loading financials…</div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {(
            [
              ["Income Statement", data.income],
              ["Balance Sheet", data.balance],
              ["Cash Flow", data.cashflow]
            ] as const
          ).map(([title, lines]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="scrollbar-thin overflow-x-auto">
                  <StatementTable periods={data.periods} lines={lines} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
