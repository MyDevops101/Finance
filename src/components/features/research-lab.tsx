"use client";

import { useMemo, useState, useTransition } from "react";
import { Play, Save } from "lucide-react";

import { saveResearchRunAction } from "@/app/actions";
import { BacktestChart } from "@/components/charts/backtest-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { runBacktest } from "@/lib/analytics";
import { formatPercent } from "@/lib/utils";

const strategyMap = {
  "Moving Average": "MOVING_AVERAGE",
  RSI: "RSI",
  MACD: "MACD",
  Momentum: "MOMENTUM",
  Factor: "FACTOR"
} as const;

type Strategy = keyof typeof strategyMap;

export function ResearchLab() {
  const [strategy, setStrategy] = useState<Strategy>("Momentum");
  const [lookback, setLookback] = useState(60);
  const [riskBudget, setRiskBudget] = useState(10);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const result = useMemo(() => runBacktest({ strategy, lookback, riskBudget }), [lookback, riskBudget, strategy]);

  function saveRun() {
    startTransition(async () => {
      const response = await saveResearchRunAction({
        name: `${strategy} research run`,
        strategy: strategyMap[strategy],
        universe: "US Large Cap",
        parameters: { lookback, riskBudget },
        metrics: result.metrics,
        equityCurve: result.series
      });
      setMessage(response.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <label>
            <span className="mb-1 block text-xs text-muted">Signal family</span>
            <Select value={strategy} onChange={(event) => setStrategy(event.target.value as Strategy)}>
              {Object.keys(strategyMap).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs text-muted">Lookback window</span>
            <input
              type="range"
              min="10"
              max="180"
              value={lookback}
              onChange={(event) => setLookback(Number(event.target.value))}
              className="w-full accent-cyan-300"
            />
            <div className="mt-1 text-right text-sm font-semibold">{lookback} days</div>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs text-muted">Risk budget</span>
            <input
              type="range"
              min="4"
              max="16"
              value={riskBudget}
              onChange={(event) => setRiskBudget(Number(event.target.value))}
              className="w-full accent-cyan-300"
            />
            <div className="mt-1 text-right text-sm font-semibold">{riskBudget}/16</div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary">
              <Play className="h-4 w-4" aria-hidden="true" />
              Run
            </Button>
            <Button onClick={saveRun} disabled={isPending}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save
            </Button>
          </div>
          {message ? <p className="text-sm text-muted">{message}</p> : null}
        </CardContent>
      </Card>
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label="CAGR" value={formatPercent(result.metrics.cagr)} tone="success" />
          <Metric label="Sharpe" value={result.metrics.sharpe.toFixed(2)} tone="primary" />
          <Metric label="Max DD" value={formatPercent(result.metrics.maxDrawdown)} tone="danger" />
          <Metric label="Alpha" value={formatPercent(result.metrics.alpha)} tone="success" />
          <Metric label="Beta" value={result.metrics.beta.toFixed(2)} tone="accent" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Backtest Equity Curve</CardTitle>
              <Badge variant="accent">US Large Cap</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <BacktestChart data={result.series} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "success" | "danger" | "primary" | "accent" }) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : tone === "accent"
          ? "text-violet-200"
          : "text-primary";

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
