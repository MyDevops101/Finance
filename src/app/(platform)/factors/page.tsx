import type { Metadata } from "next";

import { FactorModels } from "@/components/features/factor-models";
import { SectionHeading } from "@/components/market/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Factor Models",
  description: "Cross-sectional factor exposures (value, momentum, quality, size, low-vol) across the equity universe."
};

export default function FactorsPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Quant"
        title="Factor Models"
        description="Cross-sectional z-scores for value, momentum, quality, size, and low-vol, with long/short baskets per factor."
      />
      <FactorModels />
    </div>
  );
}
