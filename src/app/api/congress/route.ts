import { NextResponse } from "next/server";

import { getCongressTrades } from "@/lib/api-clients";

export async function GET() {
  const trades = await getCongressTrades();
  return NextResponse.json({
    trades,
    generatedAt: new Date().toISOString()
  });
}
