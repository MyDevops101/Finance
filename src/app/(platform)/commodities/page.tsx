import type { Metadata } from "next";

import { CommoditiesBoard } from "@/components/features/commodities-board";
import { SectionHeading } from "@/components/market/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commodities",
  description: "Commodity prices for metals, energy, and agriculture powered by Nasdaq Data Link."
};

export default function CommoditiesPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Real assets"
        title="Commodities Board"
        description="Metals, energy, and agriculture — powered by Nasdaq Data Link (add NASDAQ_DATA_LINK_API_KEY for live metals)."
      />
      <CommoditiesBoard />
    </div>
  );
}
