import { fetchJson, withFallback } from "@/lib/providers/http";

export type FxRate = {
  pair: string;
  base: string;
  quote: string;
  rate: number;
};

// Mock fallback (approximate levels) used when the FX API is unreachable.
const FALLBACK_RATES: FxRate[] = [
  { pair: "EUR/USD", base: "EUR", quote: "USD", rate: 1.0842 },
  { pair: "GBP/USD", base: "GBP", quote: "USD", rate: 1.2731 },
  { pair: "USD/JPY", base: "USD", quote: "JPY", rate: 157.42 },
  { pair: "USD/CHF", base: "USD", quote: "CHF", rate: 0.8965 },
  { pair: "USD/CAD", base: "USD", quote: "CAD", rate: 1.3712 },
  { pair: "AUD/USD", base: "AUD", quote: "USD", rate: 0.6642 },
  { pair: "USD/CNY", base: "USD", quote: "CNY", rate: 7.2489 },
  { pair: "NZD/USD", base: "NZD", quote: "USD", rate: 0.6081 }
];

const MAJORS = ["EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "NZD"];

/**
 * Live FX rates from open.er-api.com (keyless). Returns the standard set of
 * major pairs, quoting USD-based conventions (EUR/USD, USD/JPY, etc.).
 */
export async function getFxRates(): Promise<FxRate[]> {
  return withFallback(async () => {
    const payload = await fetchJson<{ result?: string; rates?: Record<string, number> }>(
      "https://open.er-api.com/v6/latest/USD",
      { ttlSeconds: 300 }
    );
    if (payload?.result !== "success" || !payload.rates) return null;
    const rates = payload.rates;

    const out: FxRate[] = [];
    for (const cur of MAJORS) {
      const usdTo = rates[cur];
      if (!usdTo) continue;
      // Quote EUR, GBP, AUD, NZD as XXX/USD; the rest as USD/XXX.
      if (["EUR", "GBP", "AUD", "NZD"].includes(cur)) {
        out.push({ pair: `${cur}/USD`, base: cur, quote: "USD", rate: 1 / usdTo });
      } else {
        out.push({ pair: `USD/${cur}`, base: "USD", quote: cur, rate: usdTo });
      }
    }
    return out.length ? out : null;
  }, FALLBACK_RATES);
}
