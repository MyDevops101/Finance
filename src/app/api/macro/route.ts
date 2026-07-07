import { NextResponse } from "next/server";

import { getMacroDashboard } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const indicators = await getMacroDashboard();
  return NextResponse.json({ indicators, generatedAt: new Date().toISOString() });
}
