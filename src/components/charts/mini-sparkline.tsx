"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

export function MiniSparkline({ data, positive = true }: { data: number[]; positive?: boolean }) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          dot={false}
          stroke={positive ? "#22C55E" : "#EF4444"}
          strokeWidth={2}
          isAnimationActive
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
