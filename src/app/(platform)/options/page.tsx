import type { Metadata } from "next";

import { OptionsChain } from "@/components/features/options-chain";
import { SectionHeading } from "@/components/market/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Options Chain",
  description: "Options chains with bid/ask, implied volatility, volume, and open interest from Tradier."
};

export default function OptionsPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Derivatives"
        title="Options Chain"
        description="Calls and puts with bid/ask, implied volatility, and volume — powered by Tradier (add TRADIER_API_KEY for live)."
      />
      <Card>
        <CardHeader>
          <CardTitle>Chain · Nearest Expiration</CardTitle>
        </CardHeader>
        <CardContent>
          <OptionsChain initialSymbol="AAPL" />
        </CardContent>
      </Card>
    </div>
  );
}
