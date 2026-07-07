import { NextResponse } from "next/server";

import { getProviderStatus } from "@/lib/api-clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const providers = getProviderStatus();
  return NextResponse.json({ providers, generatedAt: new Date().toISOString() });
}
