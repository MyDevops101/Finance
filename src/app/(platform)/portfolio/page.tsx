import type { Metadata } from "next";

import { PortfolioWorkspace } from "@/components/features/portfolio-workspace";
import { SectionHeading } from "@/components/market/section-heading";
import { portfolioHoldings } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Portfolio Tracker",
  description: "Track watchlists, holdings, allocation, performance, risk analytics, beta, and correlations."
};

export default function PortfolioPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Portfolio"
        title="Portfolio Tracker"
        description="Manage holdings, monitor performance, analyze allocation, track risk, and inspect correlation exposure."
      />
      <PortfolioWorkspace initialHoldings={portfolioHoldings} />
    </div>
  );
}
