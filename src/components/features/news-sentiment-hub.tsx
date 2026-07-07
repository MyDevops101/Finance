"use client";

import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";

import { SentimentGauge } from "@/components/charts/sentiment-gauge";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { sentimentSeries } from "@/lib/mock-data";
import type { NewsItem } from "@/lib/types";

export function NewsSentimentHub({ news }: { news: NewsItem[] }) {
  const [symbol, setSymbol] = useState("All");
  const symbols = useMemo(() => ["All", ...Array.from(new Set(news.map((item) => item.symbol)))], [news]);
  const filtered = symbol === "All" ? news : news.filter((item) => item.symbol === symbol);
  const positive = filtered.filter((item) => item.sentiment > 0.2).length;
  const negative = filtered.filter((item) => item.sentiment < -0.2).length;
  const averageSentiment = filtered.length
    ? filtered.reduce((sum, item) => sum + item.sentiment, 0) / filtered.length
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Sentiment Feed</CardTitle>
              <Select value={symbol} onChange={(event) => setSymbol(event.target.value)} className="w-32">
                {symbols.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <SentimentGauge value={averageSentiment} label="Aggregate" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-success/25 bg-success/10 p-3">
                <div className="text-xs text-muted">Positive</div>
                <div className="text-2xl font-bold text-success">{positive}</div>
              </div>
              <div className="rounded-lg border border-danger/25 bg-danger/10 p-3">
                <div className="text-xs text-muted">Negative</div>
                <div className="text-2xl font-bold text-danger">{negative}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <TimeSeriesChart data={sentimentSeries} primaryLabel="Positive mentions" secondaryLabel="Negative mentions" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border bg-white/5 p-4 transition hover:border-primary/50 hover:bg-white/10"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Newspaper className="h-4 w-4 text-primary" aria-hidden="true" />
                {item.source}
              </div>
              <Badge variant={item.sentiment > 0.2 ? "success" : item.sentiment < -0.2 ? "danger" : "muted"}>
                {item.symbol}
              </Badge>
            </div>
            <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-xs text-muted">{new Date(item.publishedAt).toLocaleString()}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
