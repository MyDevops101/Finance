import { NextResponse } from "next/server";

import { getAiInsights } from "@/lib/api-clients";

export async function GET() {
  const insights = await getAiInsights();
  return NextResponse.json({
    insights,
    generatedAt: new Date().toISOString()
  });
}
