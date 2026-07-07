import { NextRequest, NextResponse } from "next/server";

import { getOptionsChain } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const symbol = (params.get("symbol") ?? "AAPL").toUpperCase();
  const expiration = params.get("expiration") ?? undefined;
  const chain = await getOptionsChain(symbol, expiration);
  return NextResponse.json({ ...chain, generatedAt: new Date().toISOString() });
}
