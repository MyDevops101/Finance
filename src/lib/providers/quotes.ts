import { equities, marketIndices } from "@/lib/mock-data";
import { fetchJson } from "@/lib/providers/http";

export type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  source: string;
};

const FINNHUB = process.env.FINNHUB_API_KEY;
const TWELVE = process.env.TWELVE_DATA_API_KEY;
const ALPHA = process.env.ALPHA_VANTAGE_API_KEY;
const POLYGON = process.env.POLYGON_API_KEY;

function fallbackQuote(symbol: string): Quote {
  const idx = marketIndices.find((m) => m.symbol === symbol);
  const eq = equities.find((e) => e.symbol === symbol);
  const price = idx?.price ?? eq?.price ?? 100;
  const changePct = idx?.changePct ?? eq?.changePct ?? 0;
  const change = idx?.change ?? (price * changePct) / 100;
  const prevClose = price - change;
  return {
    symbol,
    price,
    change,
    changePct,
    high: price * 1.01,
    low: price * 0.99,
    open: prevClose,
    prevClose,
    source: "mock"
  };
}

async function finnhubQuote(symbol: string): Promise<Quote | null> {
  if (!FINNHUB) return null;
  const q = await fetchJson<{ c: number; d: number; dp: number; h: number; l: number; o: number; pc: number }>(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB}`,
    { ttlSeconds: 30 }
  );
  if (!q || !q.c) return null;
  return {
    symbol,
    price: q.c,
    change: q.d ?? 0,
    changePct: q.dp ?? 0,
    high: q.h ?? q.c,
    low: q.l ?? q.c,
    open: q.o ?? q.pc,
    prevClose: q.pc ?? q.c,
    source: "finnhub"
  };
}

async function twelveQuote(symbol: string): Promise<Quote | null> {
  if (!TWELVE) return null;
  const q = await fetchJson<{
    close?: string;
    change?: string;
    percent_change?: string;
    high?: string;
    low?: string;
    open?: string;
    previous_close?: string;
    code?: number;
  }>(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVE}`, {
    ttlSeconds: 30
  });
  if (!q || q.code || !q.close) return null;
  return {
    symbol,
    price: Number(q.close),
    change: Number(q.change ?? 0),
    changePct: Number(q.percent_change ?? 0),
    high: Number(q.high ?? q.close),
    low: Number(q.low ?? q.close),
    open: Number(q.open ?? q.previous_close ?? q.close),
    prevClose: Number(q.previous_close ?? q.close),
    source: "twelvedata"
  };
}

async function alphaQuote(symbol: string): Promise<Quote | null> {
  if (!ALPHA) return null;
  const payload = await fetchJson<{ "Global Quote"?: Record<string, string> }>(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA}`,
    { ttlSeconds: 60 }
  );
  const g = payload?.["Global Quote"];
  if (!g || !g["05. price"]) return null;
  const price = Number(g["05. price"]);
  return {
    symbol,
    price,
    change: Number(g["09. change"] ?? 0),
    changePct: Number((g["10. change percent"] ?? "0%").replace("%", "")),
    high: Number(g["03. high"] ?? price),
    low: Number(g["04. low"] ?? price),
    open: Number(g["02. open"] ?? price),
    prevClose: Number(g["08. previous close"] ?? price),
    source: "alphavantage"
  };
}

async function polygonQuote(symbol: string): Promise<Quote | null> {
  if (!POLYGON) return null;
  const payload = await fetchJson<{
    ticker?: {
      day?: { o: number; h: number; l: number; c: number };
      prevDay?: { c: number };
      todaysChange?: number;
      todaysChangePerc?: number;
      lastTrade?: { p: number };
    };
  }>(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${encodeURIComponent(symbol)}?apiKey=${POLYGON}`, {
    ttlSeconds: 30
  });
  const t = payload?.ticker;
  const price = t?.lastTrade?.p ?? t?.day?.c;
  if (!t || !price) return null;
  const prevClose = t.prevDay?.c ?? price;
  return {
    symbol,
    price,
    change: t.todaysChange ?? price - prevClose,
    changePct: t.todaysChangePerc ?? ((price - prevClose) / prevClose) * 100,
    high: t.day?.h ?? price,
    low: t.day?.l ?? price,
    open: t.day?.o ?? prevClose,
    prevClose,
    source: "polygon"
  };
}

/** Resolve a single quote through the provider chain, falling back to mock. */
export async function getQuote(symbol: string): Promise<Quote> {
  const sym = symbol.toUpperCase();
  const resolvers = [finnhubQuote, twelveQuote, polygonQuote, alphaQuote];
  for (const resolve of resolvers) {
    try {
      const q = await resolve(sym);
      if (q) return q;
    } catch {
      // try next provider
    }
  }
  return fallbackQuote(sym);
}

/** Resolve many quotes. Sequential to respect free-tier rate limits. */
export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  const out: Quote[] = [];
  for (const symbol of symbols) {
    out.push(await getQuote(symbol));
  }
  return out;
}
