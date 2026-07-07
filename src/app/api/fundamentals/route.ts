import { NextRequest, NextResponse } from "next/server";

import { getFinancialStatements } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = (request.nextUrl.searchParams.get("symbol") ?? "AAPL").toUpperCase();
  const statements = await getFinancialStatements(symbol);
  return NextResponse.json({ ...statements, generatedAt: new Date().toISOString() });
}
