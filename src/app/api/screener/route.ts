import { NextResponse } from "next/server";

import { getScreenerUniverse } from "@/lib/api-clients";

export async function GET() {
  const stocks = await getScreenerUniverse();
  return NextResponse.json({
    stocks,
    generatedAt: new Date().toISOString()
  });
}
