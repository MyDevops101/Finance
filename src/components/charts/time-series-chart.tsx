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
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
        <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#0B0F19",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 8,
            color: "#F8FAFC"
          }}
          labelStyle={{ color: "#F8FAFC" }}
          formatter={(value: unknown, name: unknown) => [
            Number(value).toFixed(2),
            name === "value" ? primaryLabel : secondaryLabel
          ]}
        />
        {mode === "area" ? (
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00D4FF"
            fill="url(#primary-fill)"
            strokeWidth={2}
            dot={false}
          />
        ) : (
          <Line type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} dot={false} />
        )}
        <Line type="monotone" dataKey="secondary" stroke="#8B5CF6" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
