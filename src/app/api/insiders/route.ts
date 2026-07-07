import { NextResponse } from "next/server";

import { getInsiderTrades } from "@/lib/api-clients";

export async function GET() {
  const trades = await getInsiderTrades();
  return NextResponse.json({
    trades,
    generatedAt: new Date().toISOString()
  });
}
