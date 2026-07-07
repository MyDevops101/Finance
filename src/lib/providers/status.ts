export type ProviderStatus = {
  name: string;
  category: string;
  mode: "live" | "key-required";
  keyed: boolean;
  active: boolean;
  note: string;
};

/**
 * Report the configured state of every data source so the UI can show which
 * feeds are live. Keyless sources are always "live"; keyed sources are "live"
 * only when their env var is set (otherwise they serve deterministic fallback).
 */
export function getProviderStatus(): ProviderStatus[] {
  const has = (v?: string) => Boolean(v && v.trim().length > 0);

  return [
    { name: "CoinGecko", category: "Crypto", mode: "live", keyed: false, active: true, note: "Keyless — live" },
    { name: "open.er-api", category: "FX", mode: "live", keyed: false, active: true, note: "Keyless — live" },
    { name: "SEC EDGAR", category: "Filings / Insider", mode: "live", keyed: false, active: true, note: "Keyless — live" },
    { name: "GDELT", category: "News", mode: "live", keyed: false, active: true, note: "Keyless — live" },
    { name: "ECB Data Portal", category: "EU Macro", mode: "live", keyed: false, active: true, note: "Keyless — live" },
    {
      name: "Finnhub",
      category: "Quotes / Earnings",
      mode: "key-required",
      keyed: has(process.env.FINNHUB_API_KEY),
      active: has(process.env.FINNHUB_API_KEY),
      note: has(process.env.FINNHUB_API_KEY) ? "Live" : "Set FINNHUB_API_KEY"
    },
    {
      name: "Twelve Data",
      category: "Quotes / Candles",
      mode: "key-required",
      keyed: has(process.env.TWELVE_DATA_API_KEY),
      active: has(process.env.TWELVE_DATA_API_KEY),
      note: has(process.env.TWELVE_DATA_API_KEY) ? "Live" : "Set TWELVE_DATA_API_KEY"
    },
    {
      name: "Alpha Vantage",
      category: "Quotes / Candles",
      mode: "key-required",
      keyed: has(process.env.ALPHA_VANTAGE_API_KEY),
      active: has(process.env.ALPHA_VANTAGE_API_KEY),
      note: has(process.env.ALPHA_VANTAGE_API_KEY) ? "Live" : "Set ALPHA_VANTAGE_API_KEY"
    },
    {
      name: "Financial Modeling Prep",
      category: "Fundamentals / Screener",
      mode: "key-required",
      keyed: has(process.env.FMP_API_KEY),
      active: has(process.env.FMP_API_KEY),
      note: has(process.env.FMP_API_KEY) ? "Live" : "Set FMP_API_KEY"
    },
    {
      name: "FRED",
      category: "Macro",
      mode: "key-required",
      keyed: has(process.env.FRED_API_KEY),
      active: has(process.env.FRED_API_KEY),
      note: has(process.env.FRED_API_KEY) ? "Live" : "Set FRED_API_KEY"
    },
    {
      name: "NewsAPI",
      category: "News (fallback)",
      mode: "key-required",
      keyed: has(process.env.NEWS_API_KEY),
      active: has(process.env.NEWS_API_KEY),
      note: has(process.env.NEWS_API_KEY) ? "Live" : "Optional — GDELT covers news"
    },
    {
      name: "Tradier",
      category: "Options",
      mode: "key-required",
      keyed: has(process.env.TRADIER_API_KEY),
      active: has(process.env.TRADIER_API_KEY),
      note: has(process.env.TRADIER_API_KEY) ? "Live" : "Set TRADIER_API_KEY"
    },
    {
      name: "Polygon.io",
      category: "Quotes / Candles",
      mode: "key-required",
      keyed: has(process.env.POLYGON_API_KEY),
      active: has(process.env.POLYGON_API_KEY),
      note: has(process.env.POLYGON_API_KEY) ? "Live" : "Set POLYGON_API_KEY"
    },
    {
      name: "Nasdaq Data Link",
      category: "Commodities",
      mode: "key-required",
      keyed: has(process.env.NASDAQ_DATA_LINK_API_KEY),
      active: has(process.env.NASDAQ_DATA_LINK_API_KEY),
      note: has(process.env.NASDAQ_DATA_LINK_API_KEY) ? "Live" : "Set NASDAQ_DATA_LINK_API_KEY"
    }
  ];
}
