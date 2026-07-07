import { NextResponse } from "next/server";

import { getEconomicCalendar } from "@/lib/api-clients";

export async function GET() {
  const events = await getEconomicCalendar();
  return NextResponse.json({
    events,
    generatedAt: new Date().toISOString()
  });
}
