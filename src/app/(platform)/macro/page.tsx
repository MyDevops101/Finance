import type { Metadata } from "next";

import { EcbPanel } from "@/components/features/ecb-panel";
import { MacroDashboard } from "@/components/features/macro-dashboard";
import { SectionHeading } from "@/components/market/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Macro Dashboard",
  description: "Treasury yields, Fed funds, inflation, unemployment, and the yield curve from FRED, plus ECB European macro."
};

export default function MacroPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Economics"
        title="Macro Dashboard"
        description="US series (Treasury yields, Fed funds, core CPI, unemployment, curve) from FRED, plus live European rates from the ECB."
      />
      <Card>
        <CardHeader>
          <CardTitle>United States · FRED</CardTitle>
          <span className="text-[10px] uppercase tracking-wider text-muted">Add FRED_API_KEY for live</span>
        </CardHeader>
        <CardContent className="p-3">
          <MacroDashboard />
        </CardContent>
      </Card>

      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Euro Area · ECB Data Portal</CardTitle>
            <span className="text-[10px] uppercase tracking-wider text-muted">Keyless — live</span>
          </CardHeader>
          <CardContent className="p-3">
            <EcbPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
