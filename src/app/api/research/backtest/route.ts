import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { runBacktest } from "@/lib/analytics";

const schema = z.object({
  strategy: z.enum(["Moving Average", "RSI", "MACD", "Momentum", "Factor"]).default("Momentum"),
  lookback: z.number().int().min(10).max(180).default(60),
  riskBudget: z.number().int().min(4).max(16).default(10)
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => ({}));
  const input = schema.parse(json);
  return NextResponse.json(runBacktest(input));
}
