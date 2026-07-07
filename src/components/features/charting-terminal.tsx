"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CandlestickChart, type Overlay } from "@/components/charts/candlestick-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle, CandleSeries } from "@/lib/providers/candles";
import { rsi, sma } from "@/lib/indicators";
import { cn } from "@/lib/utils";

const INTERVALS = ["15M", "1H", "1D", "1W"];

export function ChartingTerminal({ initialSymbol = "AAPL" }: { initialSymbol?: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [input, setInput] = useState(initialSymbol);
  const [interval, setInterval] = useState("1D");
  const [series, setSeries] = useState<CandleSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [sma20, setSma20] = useState(true);
  const [sma50, setSma50] = useState(true);

  const load = useCallback(async (sym: string, intv: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/candles?symbol=${encodeURIComponent(sym)}&interval=${intv}&size=90`);
      const data = (await res.json()) as CandleSeries;
      setSeries(data);
    } catch {
      setSeries(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(symbol, interval);
  }, [symbol, interval, load]);

  const candles: Candle[] = series?.candles ?? [];
  const closes = candles.map((c) => c.close);

  const overlays: Overlay[] = useMemo(() => {
    const out: Overlay[] = [];
    if (sma20) out.push({ label: "SMA 20", color: "#FF8A00", values: sma(closes, 20) });
    if (sma50) out.push({ label: "SMA 50", color: "#3B9EFF", values: sma(closes, 50) });
    return out;
  }, [closes, sma20, sma50]);

  const rsiValues = useMemo(() => rsi(closes, 14), [closes]);
  const lastRsi = [...rsiValues].reverse().find((v) => v != null) ?? null;

  const last = candles[candles.length - 1];
  const first = candles[0];
  const change = last && first ? ((last.close - first.close) / first.close) * 100 : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSymbol(input.trim().toUpperCase());
  };

  return (
    <div>
      {/* control bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <form onSubmit={submit} className="flex items-center gap-1">
          <span className="text-primary">&gt;</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-7 w-28 border border-border bg-[#0a0c0f] px-2 text-xs uppercase tracking-wider text-foreground outline-none focus:border-primary"
            placeholder="TICKER"
            aria-label="Ticker symbol"
          />
          <Button type="submit" size="sm">
            Load
          </Button>
        </form>
        <div className="flex items-center gap-1">
          {INTERVALS.map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={cn(
                "fn-key",
                interval === i ? "border-primary/70 text-primary" : ""
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setSma20((v) => !v)} className={cn("fn-key", sma20 ? "text-primary" : "text-muted")}>
            SMA20
          </button>
          <button onClick={() => setSma50((v) => !v)} className={cn("fn-key", sma50 ? "text-accent" : "text-muted")}>
            SMA50
          </button>
        </div>
      </div>

      {/* quote header */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-3 py-2">
        <span className="text-lg font-bold uppercase tracking-wide text-primary">{symbol}</span>
        {last ? (
          <>
            <span className="text-lg font-bold tabular-nums text-foreground">{last.close.toFixed(2)}</span>
            <span className={cn("text-sm font-bold tabular-nums", change >= 0 ? "text-success" : "text-danger")}>
              {change >= 0 ? "▲" : "▼"} {change.toFixed(2)}% (90 bar)
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              O {last.open.toFixed(2)} · H {last.high.toFixed(2)} · L {last.low.toFixed(2)}
            </span>
          </>
        ) : null}
        <Badge variant={series?.source === "synthetic" ? "muted" : "success"} className="ml-auto">
          {series?.source === "synthetic" ? "Sim (add key)" : `Live · ${series?.source ?? "…"}`}
        </Badge>
      </div>

      {/* candlestick */}
      <div className="h-[340px] w-full px-1">
        {loading ? (
          <div className="flex h-full items-center justify-center text-xs text-muted">Loading candles…</div>
        ) : (
          <CandlestickChart candles={candles} overlays={overlays} height={340} />
        )}
      </div>

      {/* RSI panel */}
      <div className="border-t border-border px-3 py-2">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted">
          <span>RSI (14)</span>
          <span className={cn("font-bold", lastRsi == null ? "" : lastRsi > 70 ? "text-danger" : lastRsi < 30 ? "text-success" : "text-primary")}>
            {lastRsi == null ? "--" : lastRsi.toFixed(1)}
          </span>
        </div>
        <RsiStrip values={rsiValues} />
      </div>
    </div>
  );
}

function RsiStrip({ values }: { values: (number | null)[] }) {
  const W = 1000;
  const H = 60;
  const pts = values
    .map((v, i) =>
      v == null ? null : `${((i / Math.max(1, values.length - 1)) * W).toFixed(1)},${(H - (v / 100) * H).toFixed(1)}`
    )
    .filter(Boolean)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-14 w-full" preserveAspectRatio="none">
      <line x1={0} x2={W} y1={H - (70 / 100) * H} y2={H - (70 / 100) * H} stroke="rgba(255,67,61,0.4)" strokeDasharray="4 4" />
      <line x1={0} x2={W} y1={H - (30 / 100) * H} y2={H - (30 / 100) * H} stroke="rgba(46,212,122,0.4)" strokeDasharray="4 4" />
      <polyline points={pts} fill="none" stroke="#FF8A00" strokeWidth={1.5} />
    </svg>
  );
}
