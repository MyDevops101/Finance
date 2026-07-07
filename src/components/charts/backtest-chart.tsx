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
        />
        <Line type="monotone" dataKey="strategy" stroke="#FF8A00" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="benchmark" stroke="#3B9EFF" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
