"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#FF8A00", "#2ED47A", "#3B9EFF", "#FFC24B", "#FF433D", "#9A6BFF"];

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
            background: "#05070a",
            border: "1px solid rgba(255, 138, 0, 0.4)",
            borderRadius: 2,
            color: "#E4E4E7",
            fontFamily: "var(--font-mono)"
          }}
          formatter={(value: unknown) => [`${Number(value).toFixed(1)}%`, "Weight"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
