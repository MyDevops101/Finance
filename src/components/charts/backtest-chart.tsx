"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { BacktestPoint } from "@/lib/types";

export function BacktestChart({ data }: { data: BacktestPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -18 }}>
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
        />
        <Line type="monotone" dataKey="strategy" stroke="#00D4FF" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="benchmark" stroke="#8B5CF6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
