"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OptionsChain as Chain } from "@/lib/providers/options";
import { cn } from "@/lib/utils";

export function OptionsChain({ initialSymbol = "AAPL" }: { initialSymbol?: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [input, setInput] = useState(initialSymbol);
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (sym: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/options?symbol=${encodeURIComponent(sym)}`);
      setChain((await res.json()) as Chain);
    } catch {
      setChain(null);
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

  const strikes = chain ? chain.calls.map((c) => c.strike) : [];

  return (
    <div>
      <form onSubmit={submit} className="mb-4 flex flex-wrap items-center gap-2">
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
        {chain ? (
          <>
            <span className="text-xs uppercase tracking-wider text-muted">
              Exp {chain.expiration} · Spot{" "}
              <span className="font-bold text-foreground">{chain.underlyingPrice.toFixed(2)}</span>
            </span>
            <Badge variant={chain.source === "synthetic" ? "muted" : "success"} className="ml-auto">
              {chain.source === "synthetic" ? "Sim · add TRADIER_API_KEY" : `Live · ${chain.source}`}
            </Badge>
          </>
        ) : null}
      </form>

      {loading || !chain ? (
        <div className="py-10 text-center text-xs text-muted">Loading options chain…</div>
      ) : (
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-xs tabular-nums">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted">
                <th className="px-2 py-1 text-right" colSpan={4}>
                  Calls
                </th>
                <th className="px-2 py-1 text-center text-primary">Strike</th>
                <th className="px-2 py-1 text-left" colSpan={4}>
                  Puts
                </th>
              </tr>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted">
                <th className="px-2 py-1 text-right">Vol</th>
                <th className="px-2 py-1 text-right">IV</th>
                <th className="px-2 py-1 text-right">Bid</th>
                <th className="px-2 py-1 text-right">Ask</th>
                <th className="px-2 py-1 text-center" />
                <th className="px-2 py-1 text-right">Bid</th>
                <th className="px-2 py-1 text-right">Ask</th>
                <th className="px-2 py-1 text-right">IV</th>
                <th className="px-2 py-1 text-right">Vol</th>
              </tr>
            </thead>
            <tbody>
              {strikes.map((strike, i) => {
                const call = chain.calls[i];
                const put = chain.puts.find((p) => p.strike === strike);
                const isAtm = Math.abs(strike - chain.underlyingPrice) < (strikes[1] - strikes[0]) / 2;
                return (
                  <tr key={strike} className={cn("border-b border-border/60", isAtm && "bg-primary/10")}>
                    <td className="px-2 py-1 text-right text-muted">{call?.volume.toLocaleString() ?? "--"}</td>
                    <td className="px-2 py-1 text-right text-muted">{call ? `${(call.iv * 100).toFixed(1)}%` : "--"}</td>
                    <td className="px-2 py-1 text-right text-success">{call?.bid.toFixed(2) ?? "--"}</td>
                    <td className="px-2 py-1 text-right text-danger">{call?.ask.toFixed(2) ?? "--"}</td>
                    <td className="px-2 py-1 text-center font-bold text-primary">{strike}</td>
                    <td className="px-2 py-1 text-right text-success">{put?.bid.toFixed(2) ?? "--"}</td>
                    <td className="px-2 py-1 text-right text-danger">{put?.ask.toFixed(2) ?? "--"}</td>
                    <td className="px-2 py-1 text-right text-muted">{put ? `${(put.iv * 100).toFixed(1)}%` : "--"}</td>
                    <td className="px-2 py-1 text-right text-muted">{put?.volume.toLocaleString() ?? "--"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
