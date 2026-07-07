import { equities } from "@/lib/mock-data";
import type { Equity } from "@/lib/types";
import { fetchJson, withFallback } from "@/lib/providers/http";

const FMP = process.env.FMP_API_KEY;

type FmpScreenerRow = {
  symbol: string;
  companyName: string;
  sector: string;
  country: string;
  price: number;
  changesPercentage?: number;
  marketCap: number;
  beta: number;
  pe: number;
  lastAnnualDividend?: number;
};

/** Live equity screener universe from FMP (keyed) or the mock universe. */
export async function getScreenerUniverse(): Promise<Equity[]> {
  if (!FMP) return equities;
  return withFallback(async () => {
    const rows = await fetchJson<FmpScreenerRow[]>(
      `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=1000000000&limit=80&apikey=${FMP}`,
      { ttlSeconds: 900 }
    );
    if (!rows?.length) return null;
    return rows.slice(0, 60).map((row) => ({
      symbol: row.symbol,
      name: row.companyName ?? row.symbol,
      sector: row.sector || "Unknown",
      country: row.country || "Unknown",
      price: row.price ?? 0,
      changePct: row.changesPercentage ?? 0,
      marketCap: row.marketCap ?? 0,
      revenueGrowth: 0,
      peRatio: row.pe ?? 0,
      dividendYield: row.price ? ((row.lastAnnualDividend ?? 0) / row.price) * 100 : 0,
      shortInterest: 0,
      beta: row.beta ?? 1,
      // Simple composite score so the screener is sortable even from live data.
      quantScore: Math.min(99, Math.max(1, Math.round(50 + (row.changesPercentage ?? 0) * 3))),
      sentiment: 50
    }));
  }, equities);
}
