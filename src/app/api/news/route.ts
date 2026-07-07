import { NextRequest, NextResponse } from "next/server";

import { getNews } from "@/lib/api-clients";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? undefined;
  const news = await getNews(symbol);
  return NextResponse.json({
    news,
    generatedAt: new Date().toISOString()
  });
}
