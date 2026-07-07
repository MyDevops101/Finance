"use client";

import { useMemo } from "react";

import type { Candle } from "@/lib/providers/candles";

export type Overlay = { label: string; color: string; values: (number | null)[] };

const W = 1000;

export function CandlestickChart({
  candles,
  overlays = [],
  height = 360
}: {
  candles: Candle[];
  overlays?: Overlay[];
  height?: number;
}) {
  const model = useMemo(() => {
    if (!candles.length) return null;
    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);
    let min = Math.min(...lows);
    let max = Math.max(...highs);
    for (const o of overlays) {
      for (const v of o.values) {
        if (v == null) continue;
        min = Math.min(min, v);
        max = Math.max(max, v);
      }
    }
    const pad = (max - min) * 0.06 || 1;
    min -= pad;
    max += pad;

    const plotH = height - 24; // leave room for x labels
    const x = (i: number) => (i / Math.max(1, candles.length - 1)) * (W - 60) + 40;
    const y = (v: number) => plotH - ((v - min) / (max - min)) * (plotH - 12) - 6;
    const bodyW = Math.max(1.5, ((W - 60) / candles.length) * 0.6);

    return { min, max, plotH, x, y, bodyW };
  }, [candles, overlays, height]);

  if (!model) {
    return <div className="flex h-full items-center justify-center text-xs text-muted">No data</div>;
  }

  const { plotH, x, y, bodyW, min, max } = model;
  const gridLines = 4;
  const labelIdx = [0, Math.floor(candles.length / 2), candles.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-full w-full" preserveAspectRatio="none">
      {/* horizontal grid + price labels */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const value = min + ((max - min) * i) / gridLines;
        const yy = y(value);
        return (
          <g key={i}>
            <line x1={40} x2={W - 20} y1={yy} y2={yy} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={W - 16} y={yy + 3} fontSize={11} fill="#8A8F98" fontFamily="var(--font-mono)">
              {value.toFixed(value > 1000 ? 0 : 2)}
            </text>
          </g>
        );
      })}

      {/* candles */}
      {candles.map((c, i) => {
        const up = c.close >= c.open;
        const color = up ? "#2ED47A" : "#FF433D";
        const cx = x(i);
        const yHigh = y(c.high);
        const yLow = y(c.low);
        const yOpen = y(c.open);
        const yClose = y(c.close);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(1, Math.abs(yClose - yOpen));
        return (
          <g key={c.time}>
            <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={color} strokeWidth={1} />
            <rect x={cx - bodyW / 2} y={top} width={bodyW} height={bodyH} fill={color} />
          </g>
        );
      })}

      {/* overlays (moving averages) */}
      {overlays.map((o) => {
        const d = o.values
          .map((v, i) => (v == null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`))
          .filter(Boolean)
          .join(" ");
        return <polyline key={o.label} points={d} fill="none" stroke={o.color} strokeWidth={1.5} />;
      })}

      {/* x labels */}
      {labelIdx.map((i) => (
        <text
          key={i}
          x={x(i)}
          y={plotH + 16}
          fontSize={11}
          fill="#8A8F98"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          {candles[i]?.time?.slice(5)}
        </text>
      ))}
    </svg>
  );
}
