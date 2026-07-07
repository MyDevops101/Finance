"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#00D4FF", "#22C55E", "#8B5CF6", "#F59E0B", "#EF4444", "#38BDF8"];

export function AllocationChart({ data }: { data: Array<{ sector: string; weight: number; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="weight" nameKey="sector" innerRadius={56} outerRadius={88} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.sector} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#0B0F19",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 8,
            color: "#F8FAFC"
          }}
          formatter={(value: unknown) => [`${Number(value).toFixed(1)}%`, "Weight"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
