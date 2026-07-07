import { backtestSeries, defaultBacktestMetrics } from "@/lib/mock-data";
import type { BacktestMetrics, BacktestPoint, PortfolioHolding } from "@/lib/types";

export function calculatePortfolioValue(holdings: PortfolioHolding[]) {
  return holdings.reduce((total, holding) => total + holding.shares * holding.lastPrice, 0);
}

export function calculatePortfolioCost(holdings: PortfolioHolding[]) {
  return holdings.reduce((total, holding) => total + holding.shares * holding.avgCost, 0);
}

export function calculatePortfolioBeta(holdings: PortfolioHolding[]) {
  const value = calculatePortfolioValue(holdings);
  if (!value) return 0;
  return holdings.reduce((sum, holding) => {
    const weight = (holding.shares * holding.lastPrice) / value;
    return sum + weight * holding.beta;
  }, 0);
}

export function getSectorAllocation(holdings: PortfolioHolding[]) {
  const value = calculatePortfolioValue(holdings);
  return Object.entries(
    holdings.reduce<Record<string, number>>((acc, holding) => {
      acc[holding.sector] = (acc[holding.sector] ?? 0) + holding.shares * holding.lastPrice;
      return acc;
    }, {})
  ).map(([sector, sectorValue]) => ({
    sector,
    value: sectorValue,
    weight: value ? (sectorValue / value) * 100 : 0
  }));
}

export function runBacktest(options: {
  strategy: "Moving Average" | "RSI" | "MACD" | "Momentum" | "Factor";
  lookback: number;
  riskBudget: number;
}): { series: BacktestPoint[]; metrics: BacktestMetrics } {
  const strategyBoost =
    options.strategy === "Factor"
      ? 1.12
      : options.strategy === "Momentum"
        ? 1.08
        : options.strategy === "MACD"
          ? 1.04
          : options.strategy === "RSI"
            ? 0.98
            : 1;

  const riskAdjustment = Math.max(0.78, Math.min(1.22, options.riskBudget / 10));
  const lookbackAdjustment = options.lookback > 120 ? 0.97 : options.lookback < 30 ? 1.03 : 1;

  const series = backtestSeries.map((point, index) => {
    const activeReturn = (point.strategy - 100) * strategyBoost * riskAdjustment * lookbackAdjustment;
    const dampener = 1 - Math.min(index, 10) * 0.006;
    return {
      ...point,
      strategy: Number((100 + activeReturn * dampener).toFixed(2))
    };
  });

  const ending = series.at(-1)?.strategy ?? 100;
  const cagr = (ending / 100 - 1) * 100;
  const beta = Number((0.72 + riskAdjustment * 0.2).toFixed(2));
  const alpha = cagr - ((series.at(-1)?.benchmark ?? 100) - 100);

  return {
    series,
    metrics: {
      cagr: Number(cagr.toFixed(1)),
      sharpe: Number((defaultBacktestMetrics.sharpe * strategyBoost * (1.04 - beta / 20)).toFixed(2)),
      maxDrawdown: Number((-6.5 * riskAdjustment * (options.lookback < 30 ? 1.35 : 1)).toFixed(1)),
      alpha: Number(alpha.toFixed(1)),
      beta
    }
  };
}
