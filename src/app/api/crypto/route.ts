import { NextResponse } from "next/server";

import { getCryptoMarkets } from "@/lib/api-clients";

export async function GET() {
  const assets = await getCryptoMarkets();
  return NextResponse.json({
    assets,
    generatedAt: new Date().toISOString()
  });
}
