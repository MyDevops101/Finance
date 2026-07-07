"use client";

import { useState } from "react";
import { Bot, RefreshCw, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AiInsight } from "@/lib/types";

export function AiInsightsPanel({ insights }: { insights: AiInsight[] }) {
  const [runs, setRuns] = useState(1284);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>AI Insights Engine</CardTitle>
              <p className="mt-1 text-sm text-muted">Signals blend sentiment, filings, technicals, macro sensitivity, and risk.</p>
            </div>
            <Button onClick={() => setRuns((value) => value + 1)}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <SignalStat label="Model runs" value={runs.toLocaleString()} />
            <SignalStat label="Avg confidence" value="73.6%" />
            <SignalStat label="Vol forecast window" value="21D" />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-5 xl:grid-cols-3">
        {insights.map((insight) => {
          const Icon =
            insight.stance === "Bullish" ? TrendingUp : insight.stance === "Bearish" ? TrendingDown : ShieldAlert;
          const variant = insight.stance === "Bullish" ? "success" : insight.stance === "Bearish" ? "danger" : "default";
          return (
            <Card key={insight.symbol}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CardTitle>{insight.symbol}</CardTitle>
                  </div>
                  <Badge variant={variant}>{insight.stance}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Score label="Trend" value={insight.trendScore} />
                <Score label="Risk" value={insight.riskScore} invert />
                <Score label="Volatility forecast" value={insight.volatilityForecast} invert />
                <Score label="Confidence" value={insight.confidence} />
                <p className="rounded-lg border border-border bg-white/5 p-3 text-sm leading-6 text-slate-300">
                  {insight.rationale}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Score({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const good = invert ? value <= 45 : value >= 65;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className={good ? "font-semibold text-success" : "font-semibold text-primary"}>{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function SignalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
