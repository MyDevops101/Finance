import { NextResponse } from "next/server";

import { getCommodities } from "@/lib/providers/commodities";

export const dynamic = "force-dynamic";

export async function GET() {
  const commodities = await getCommodities();
  return NextResponse.json({ commodities, generatedAt: new Date().toISOString() });
}
