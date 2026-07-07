import type { Equity } from "@/lib/types";
import { getScreenerUniverse } from "@/lib/providers/screener";

export type FactorKey = "value" | "momentum" | "quality" | "size" | "lowVol";

export type FactorScore = {
  symbol: string;
  name: string;
  sector: string;
  value: number;
  momentum: number;
  quality: number;
  size: number;
  lowVol: number;
  composite: number;
};

export type FactorSummary = {
  key: FactorKey;
  name: string;
  description: string;
  longs: string[];
  shorts: string[];
  spread: number;
};

export type FactorModel = {
  scores: FactorScore[];
  factors: FactorSummary[];
  source: string;
};

// z-score a metric across the universe; `invert` flips sign (e.g. cheaper P/E is
// a stronger value signal, so we invert it).
function zScores(values: number[], invert = false): number[] {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance) || 1;
  return values.map((v) => {
    const z = (v - mean) / sd;
    return invert ? -z : z;
  });
}

const META: Record<FactorKey, { name: string; description: string }> = {
  value: { name: "Value", description: "Cheap earnings multiple (inverse P/E)" },
  momentum: { name: "Momentum", description: "Recent price change / trend strength" },
  quality: { name: "Quality", description: "Revenue growth as a profitability proxy" },
  size: { name: "Size (SMB)", description: "Tilt toward smaller market caps" },
  lowVol: { name: "Low Volatility", description: "Preference for low beta names" }
};

export async function getFactorModel(): Promise<FactorModel> {
  const universe: Equity[] = await getScreenerUniverse();

  const value = zScores(universe.map((e) => e.peRatio || 0), true);
  const momentum = zScores(universe.map((e) => e.changePct));
  const quality = zScores(universe.map((e) => e.revenueGrowth));
  const size = zScores(universe.map((e) => Math.log10(Math.max(1, e.marketCap))), true);
  const lowVol = zScores(universe.map((e) => e.beta || 1), true);

  const scores: FactorScore[] = universe.map((e, i) => ({
    symbol: e.symbol,
    name: e.name,
    sector: e.sector,
    value: value[i],
    momentum: momentum[i],
    quality: quality[i],
    size: size[i],
    lowVol: lowVol[i],
    composite: (value[i] + momentum[i] + quality[i] + size[i] + lowVol[i]) / 5
  }));

  const factors: FactorSummary[] = (Object.keys(META) as FactorKey[]).map((key) => {
    const ranked = [...scores].sort((a, b) => b[key] - a[key]);
    const longs = ranked.slice(0, 3).map((s) => s.symbol);
    const shorts = ranked.slice(-3).map((s) => s.symbol);
    const spread = (ranked[0]?.[key] ?? 0) - (ranked[ranked.length - 1]?.[key] ?? 0);
    return { key, name: META[key].name, description: META[key].description, longs, shorts, spread };
  });

  return { scores, factors, source: universe.length > 10 ? "live" : "universe" };
}
