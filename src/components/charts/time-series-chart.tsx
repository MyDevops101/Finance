"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { TimeSeriesPoint } from "@/lib/types";

export function TimeSeriesChart({
  data,
  primaryLabel = "Primary",
  secondaryLabel = "Secondary",
  mode = "area"
}: {
  data: TimeSeriesPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  mode?: "area" | "line";
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="primary-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255, 138, 0, 0.1)" vertical={false} />
        <XAxis dataKey="date" stroke="#8A8F98" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis stroke="#8A8F98" tickLine={false} axisLine={false} fontSize={11} />
        <Tooltip
          contentStyle={{
            background: "#05070a",
            border: "1px solid rgba(255, 138, 0, 0.4)",
            borderRadius: 2,
            color: "#E4E4E7",
            fontFamily: "var(--font-mono)"
          }}
          labelStyle={{ color: "#FF8A00" }}
          formatter={(value: unknown, name: unknown) => [
            Number(value).toFixed(2),
            name === "value" ? primaryLabel : secondaryLabel
          ]}
        />
        {mode === "area" ? (
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FF8A00"
            fill="url(#primary-fill)"
            strokeWidth={2}
            dot={false}
          />
        ) : (
          <Line type="monotone" dataKey="value" stroke="#FF8A00" strokeWidth={2} dot={false} />
        )}
        <Line type="monotone" dataKey="secondary" stroke="#3B9EFF" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
