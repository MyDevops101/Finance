import { fetchJson } from "@/lib/providers/http";

export type Commodity = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  unit: string;
  sparkline: number[];
  source: string;
};

const NASDAQ = process.env.NASDAQ_DATA_LINK_API_KEY;

// Base levels for the deterministic synthetic basket (used as fallback and for
// the commodities without a free Nasdaq dataset).
const BASKET: Array<{ symbol: string; name: string; base: string; unit: string; nasdaq?: string; col?: number }> = [
  { symbol: "GC", name: "Gold", base: "2380", unit: "$/oz", nasdaq: "LBMA/GOLD", col: 1 },
  { symbol: "SI", name: "Silver", base: "29.4", unit: "$/oz", nasdaq: "LBMA/SILVER", col: 1 },
  { symbol: "CL", name: "Crude Oil WTI", base: "78.6", unit: "$/bbl" },
  { symbol: "NG", name: "Natural Gas", base: "2.85", unit: "$/MMBtu" },
  { symbol: "HG", name: "Copper", base: "4.42", unit: "$/lb" },
  { symbol: "ZW", name: "Wheat", base: "612", unit: "¢/bu" },
  { symbol: "ZC", name: "Corn", base: "455", unit: "¢/bu" },
  { symbol: "KC", name: "Coffee", base: "228", unit: "¢/lb" }
];

function seededWalk(seed: number, base: number, n = 20): number[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out: number[] = [];
  let v = base * (0.96 + rand() * 0.04);
  for (let i = 0; i < n; i += 1) {
    v = Math.max(0.01, v + (rand() - 0.48) * base * 0.015);
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

async function nasdaqLatest(dataset: string, col: number): Promise<number[] | null> {
  if (!NASDAQ) return null;
  const payload = await fetchJson<{ dataset?: { data?: (string | number)[][] } }>(
    `https://data.nasdaq.com/api/v3/datasets/${dataset}.json?rows=20&api_key=${NASDAQ}`,
    { ttlSeconds: 3600 }
  );
  const rows = payload?.dataset?.data;
  if (!rows?.length) return null;
  // Rows are newest-first; column `col` holds the price. Reverse for oldest-first.
  const series = rows
    .map((r) => Number(r[col]))
    .filter((n) => !Number.isNaN(n) && n > 0)
    .reverse();
  return series.length ? series : null;
}

/** Commodity prices: live gold/silver via Nasdaq Data Link (keyed) + synthetic basket. */
export async function getCommodities(): Promise<Commodity[]> {
  return Promise.all(
    BASKET.map(async (c, i) => {
      let series: number[] | null = null;
      let source = "synthetic";
      if (c.nasdaq && c.col != null) {
        try {
          series = await nasdaqLatest(c.nasdaq, c.col);
          if (series) source = "nasdaq";
        } catch {
          series = null;
        }
      }
      if (!series) series = seededWalk(c.symbol.charCodeAt(0) * (i + 3), Number(c.base));
      const price = series[series.length - 1];
      const prev = series[series.length - 2] ?? price;
      return {
        symbol: c.symbol,
        name: c.name,
        price,
        changePct: prev ? ((price - prev) / prev) * 100 : 0,
        unit: c.unit,
        sparkline: series.slice(-12),
        source
      };
    })
  );
}
