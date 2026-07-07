import { NextResponse } from "next/server";

import { getMarketOverview } from "@/lib/api-clients";
import { sectorReturns } from "@/lib/mock-data";

export async function GET() {
  const indices = await getMarketOverview();
  return NextResponse.json({
    indices,
    sectors: sectorReturns,
    generatedAt: new Date().toISOString()
  });
}
