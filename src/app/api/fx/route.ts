import { NextResponse } from "next/server";

import { getFxRates } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await getFxRates();
  return NextResponse.json({ rates, generatedAt: new Date().toISOString() });
}
