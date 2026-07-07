import { NextRequest, NextResponse } from "next/server";

import { getCandles } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const symbol = (params.get("symbol") ?? "AAPL").toUpperCase();
  const interval = params.get("interval") ?? "1D";
  const size = Math.min(400, Math.max(20, Number(params.get("size") ?? 90)));
  const series = await getCandles(symbol, interval, size);
  return NextResponse.json({ ...series, generatedAt: new Date().toISOString() });
}
