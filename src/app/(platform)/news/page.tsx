import type { Metadata } from "next";

import { NewsSentimentHub } from "@/components/features/news-sentiment-hub";
import { SectionHeading } from "@/components/market/section-heading";
import { getNews } from "@/lib/api-clients";

export const metadata: Metadata = {
  title: "News Sentiment Hub",
  description: "Aggregate market news with stock-level sentiment scores, positive mentions, negative mentions, and trend charts."
};

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div>
      <SectionHeading
        eyebrow="Sentiment"
        title="News Sentiment Hub"
        description="Aggregate news across sources, score stock-level sentiment, and monitor positive and negative mention trends."
      />
      <NewsSentimentHub news={news} />
    </div>
  );
}
