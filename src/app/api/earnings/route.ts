import { NextResponse } from "next/server";

import { getEarningsCalendar } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const earnings = await getEarningsCalendar();
  return NextResponse.json({ earnings, generatedAt: new Date().toISOString() });
}
