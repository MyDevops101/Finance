import type { Metadata } from "next";

import { ResearchLab } from "@/components/features/research-lab";
import { SectionHeading } from "@/components/market/section-heading";

export const metadata: Metadata = {
  title: "Quant Research Lab",
  description: "Backtest moving average, RSI, MACD, momentum, and factor investing strategies."
};

export default function ResearchLabPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Backtesting"
        title="Quant Research Lab"
        description="Create and test strategies using moving averages, RSI, MACD, momentum, and factor investing signals."
      />
      <ResearchLab />
    </div>
  );
}
