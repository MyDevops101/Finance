import { NextResponse } from "next/server";

import { portfolioHoldings } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    holdings: portfolioHoldings,
    generatedAt: new Date().toISOString()
  });
}
