import { equities, marketIndices } from "@/lib/mock-data";
import { fetchJson } from "@/lib/providers/http";

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type CandleSeries = {
  symbol: string;
  interval: string;
  candles: Candle[];
  source: string;
};

const TWELVE = process.env.TWELVE_DATA_API_KEY;
const ALPHA = process.env.ALPHA_VANTAGE_API_KEY;
const POLYGON = process.env.POLYGON_API_KEY;

// Map our interval tokens to each provider's expected format.
const TWELVE_INTERVALS: Record<string, string> = {
  "1D": "1day",
  "1H": "1h",
  "15M": "15min",
  "1W": "1week"
};

async function twelveCandles(symbol: string, interval: string, size: number): Promise<CandleSeries | null> {
  if (!TWELVE) return null;
  const ti = TWELVE_INTERVALS[interval] ?? "1day";
  const payload = await fetchJson<{
    values?: Array<{ datetime: string; open: string; high: string; low: string; close: string; volume: string }>;
    status?: string;
  }>(
    `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${ti}&outputsize=${size}&apikey=${TWELVE}`,
    { ttlSeconds: 120 }
  );
  if (!payload?.values?.length) return null;
  const candles = payload.values
    .map((v) => ({
      time: v.datetime,
      open: Number(v.open),
      high: Number(v.high),
      low: Number(v.low),
      close: Number(v.close),
      volume: Number(v.volume ?? 0)
    }))
    .reverse();
  return { symbol, interval, candles, source: "twelvedata" };
}

async function alphaCandles(symbol: string, size: number): Promise<CandleSeries | null> {
  if (!ALPHA) return null;
  const payload = await fetchJson<{
    "Time Series (Daily)"?: Record<
      string,
      { "1. open": string; "2. high": string; "3. low": string; "4. close": string; "5. volume": string }
    >;
  }>(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${ALPHA}`,
    { ttlSeconds: 300 }
  );
  const series = payload?.["Time Series (Daily)"];
  if (!series) return null;
  const candles = Object.entries(series)
    .map(([date, v]) => ({
      time: date,
      open: Number(v["1. open"]),
      high: Number(v["2. high"]),
      low: Number(v["3. low"]),
      close: Number(v["4. close"]),
      volume: Number(v["5. volume"])
    }))
    .reverse()
    .slice(-size);
  return { symbol, interval: "1D", candles, source: "alphavantage" };
}

/**
 * Deterministic synthetic OHLCV so candlestick charts always render even
 * without an API key. Seeded by the symbol so a given ticker looks stable.
 */
function syntheticCandles(symbol: string, size: number): CandleSeries {
  const idx = marketIndices.find((m) => m.symbol === symbol);
  const eq = equities.find((e) => e.symbol === symbol);
  const seedPrice = idx?.price ?? eq?.price ?? 100 + (symbol.charCodeAt(0) % 40);

  let seed = 0;
  for (let i = 0; i < symbol.length; i += 1) seed += symbol.charCodeAt(i) * (i + 1);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const candles: Candle[] = [];
  let close = seedPrice * (0.9 + rand() * 0.05);
  const now = Date.now();
  for (let i = size - 1; i >= 0; i -= 1) {
    const open = close;
    const drift = (rand() - 0.48) * seedPrice * 0.02;
    close = Math.max(1, open + drift);
    const high = Math.max(open, close) * (1 + rand() * 0.01);
    const low = Math.min(open, close) * (1 - rand() * 0.01);
    const date = new Date(now - i * 86_400_000);
    candles.push({
      time: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round((5 + rand() * 20) * 1_000_000)
    });
  }
  return { symbol, interval: "1D", candles, source: "synthetic" };
}

async function polygonCandles(symbol: string, size: number): Promise<CandleSeries | null> {
  if (!POLYGON) return null;
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - (size + 20) * 86_400_000).toISOString().slice(0, 10);
  const payload = await fetchJson<{
    results?: Array<{ t: number; o: number; h: number; l: number; c: number; v: number }>;
  }>(
    `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(symbol)}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=${size + 20}&apiKey=${POLYGON}`,
    { ttlSeconds: 300 }
  );
  if (!payload?.results?.length) return null;
  const candles = payload.results.slice(-size).map((r) => ({
    time: new Date(r.t).toISOString().slice(0, 10),
    open: r.o,
    high: r.h,
    low: r.l,
    close: r.c,
    volume: r.v
  }));
  return { symbol, interval: "1D", candles, source: "polygon" };
}

export async function getCandles(symbol: string, interval = "1D", size = 90): Promise<CandleSeries> {
  const sym = symbol.toUpperCase();
  try {
    const twelve = await twelveCandles(sym, interval, size);
    if (twelve) return twelve;
    const polygon = await polygonCandles(sym, size);
    if (polygon) return polygon;
    const alpha = await alphaCandles(sym, size);
    if (alpha) return alpha;
  } catch {
    // fall through to synthetic
  }
  return syntheticCandles(sym, size);
}
