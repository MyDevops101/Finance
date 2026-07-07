import { NextRequest, NextResponse } from "next/server";

import { getFilings, getInsiderFilings } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const symbol = params.get("symbol");
  const insider = params.get("insider");

  if (insider) {
    const filings = await getInsiderFilings();
    return NextResponse.json({ filings, generatedAt: new Date().toISOString() });
  }

  const formsParam = params.get("forms");
  const forms = formsParam ? formsParam.split(",").map((f) => f.trim()) : undefined;
  const filings = await getFilings((symbol ?? "AAPL").toUpperCase(), forms);
  return NextResponse.json({ filings, generatedAt: new Date().toISOString() });
}
