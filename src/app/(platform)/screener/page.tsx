import type { Metadata } from "next";

import { StockScreener } from "@/components/features/stock-screener";
import { SectionHeading } from "@/components/market/section-heading";
import { getScreenerUniverse } from "@/lib/api-clients";

export const metadata: Metadata = {
  title: "Stock Screener",
  description: "Screen equities by market cap, growth, sector, country, PE, dividend yield, short interest, beta, and quant score."
};

export default async function ScreenerPage() {
  const stocks = await getScreenerUniverse();

  return (
    <div>
      <SectionHeading
        eyebrow="Stock screener"
        title="Find Investable Signals"
        description="Filter equities by fundamentals, quality, sentiment, risk, valuation, country, sector, and market structure."
      />
      <StockScreener stocks={stocks} />
    </div>
  );
}
