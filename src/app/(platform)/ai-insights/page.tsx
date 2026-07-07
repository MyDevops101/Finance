import type { Metadata } from "next";

import { AiInsightsPanel } from "@/components/features/ai-insights-panel";
import { SectionHeading } from "@/components/market/section-heading";
import { getAiInsights } from "@/lib/api-clients";

export const metadata: Metadata = {
  title: "AI Insights",
  description: "AI-powered bullish and bearish signals, trend scores, risk scores, volatility forecasts, and confidence metrics."
};

export default async function AiInsightsPage() {
  const insights = await getAiInsights();

  return (
    <div>
      <SectionHeading
        eyebrow="AI signals"
        title="AI Insights"
        description="Generate bullish, bearish, trend, risk, and volatility forecasts with confidence metrics."
      />
      <AiInsightsPanel insights={insights} />
    </div>
  );
}
