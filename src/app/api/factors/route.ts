import { NextResponse } from "next/server";

import { getFactorModel } from "@/lib/providers/factors";

export const dynamic = "force-dynamic";

export async function GET() {
  const model = await getFactorModel();
  return NextResponse.json({ ...model, generatedAt: new Date().toISOString() });
}
