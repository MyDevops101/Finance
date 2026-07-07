import { NextRequest, NextResponse } from "next/server";

import { getQuotes } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

const DEFAULT = ["AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "JPM"];

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("symbols");
  const symbols = param
    ? param.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean).slice(0, 15)
    : DEFAULT;
  const quotes = await getQuotes(symbols);
  return NextResponse.json({ quotes, generatedAt: new Date().toISOString() });
}
