"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Quote } from "@/lib/providers/quotes";
import { cn } from "@/lib/utils";

const DEFAULT = ["AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "JPM", "SPY"];
const REFRESH_MS = 20_000;

export function LiveWatchlist() {
  const [symbols, setSymbols] = useState<string[]>(DEFAULT);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [input, setInput] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const prev = useRef<Record<string, number>>({});

  const load = useCallback(async (syms: string[]) => {
    try {
      const res = await fetch(`/api/quotes?symbols=${syms.join(",")}`);
      const data = (await res.json()) as { quotes: Quote[] };
      const map: Record<string, Quote> = {};
      for (const q of data.quotes) map[q.symbol] = q;
      setQuotes((old) => {
        for (const q of data.quotes) prev.current[q.symbol] = old[q.symbol]?.price ?? q.price;
        return map;
      });
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch {
      // keep last snapshot
    }
  }, []);

  useEffect(() => {
    load(symbols);
    const id = window.setInterval(() => load(symbols), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [symbols, load]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = input.trim().toUpperCase();
    if (sym && !symbols.includes(sym)) setSymbols((s) => [...s, sym].slice(0, 15));
    setInput("");
  };

  const remove = (sym: string) => setSymbols((s) => s.filter((x) => x !== sym));

  return (
    <div>
      <form onSubmit={add} className="flex items-center gap-1 border-b border-border px-3 py-2">
        <span className="text-primary">+</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ADD TICKER"
          aria-label="Add ticker to watchlist"
          className="h-7 w-32 border border-border bg-[#0a0c0f] px-2 text-xs uppercase tracking-wider text-foreground outline-none focus:border-primary"
        />
        <span className="ml-auto text-[10px] uppercase tracking-wider text-muted">
          {updatedAt ? `Updated ${updatedAt}` : "Loading…"}
        </span>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Last</TableHead>
            <TableHead className="text-right">Chg</TableHead>
            <TableHead className="text-right">%</TableHead>
            <TableHead className="text-right">Src</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {symbols.map((sym) => {
            const q = quotes[sym];
            const up = (q?.changePct ?? 0) >= 0;
            const flash = q && prev.current[sym] != null && q.price !== prev.current[sym];
            return (
              <TableRow key={sym}>
                <TableCell className="font-bold text-primary">{sym}</TableCell>
                <TableCell className={cn("text-right tabular-nums", flash && (up ? "text-success" : "text-danger"))}>
                  {q ? q.price.toFixed(2) : "--"}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", up ? "text-success" : "text-danger")}>
                  {q ? `${up ? "+" : ""}${q.change.toFixed(2)}` : "--"}
                </TableCell>
                <TableCell className={cn("text-right font-bold tabular-nums", up ? "text-success" : "text-danger")}>
                  {q ? `${up ? "▲" : "▼"} ${q.changePct.toFixed(2)}%` : "--"}
                </TableCell>
                <TableCell className="text-right text-[10px] uppercase text-muted">
                  {q?.source === "mock" ? "sim" : q?.source ?? "…"}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => remove(sym)}
                    aria-label={`Remove ${sym}`}
                    className="text-muted hover:text-danger"
                  >
                    ✕
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
