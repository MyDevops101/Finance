import {
  aiInsights,
  congressTrades,
  cryptoAssets,
  economicEvents,
  equities,
  insiderTrades,
  marketIndices,
  newsItems
} from "@/lib/mock-data";

type FetchOptions = {
  next?: {
    revalidate?: number;
  };
};

const DEFAULT_REVALIDATE = Number(process.env.MARKET_DATA_CACHE_SECONDS ?? 300);

async function fetchJson<T>(url: string, options?: FetchOptions): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getMarketOverview() {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return marketIndices;

  const payload = await fetchJson<{
    "Global Quote"?: Record<string, string>;
  }>(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${key}`,
    { next: { revalidate: DEFAULT_REVALIDATE } }
  );

  const quote = payload?.["Global Quote"];
  if (!quote) return marketIndices;

  return marketIndices.map((index) =>
    index.symbol === "SPY"
      ? {
          ...index,
          price: Number(quote["05. price"] ?? index.price),
          change: Number(quote["09. change"] ?? index.change),
          changePct: Number((quote["10. change percent"] ?? `${index.changePct}%`).replace("%", ""))
        }
      : index
  );
}

export async function getScreenerUniverse() {
  const key = process.env.FMP_API_KEY;
  if (!key) return equities;

  const payload = await fetchJson<
    Array<{
      symbol: string;
      companyName: string;
      sector: string;
      country: string;
      price: number;
      changesPercentage: number;
      marketCap: number;
      beta: number;
      pe: number;
      lastAnnualDividend: number;
    }>
  >(`https://financialmodelingprep.com/api/v3/stock-screener?limit=100&apikey=${key}`, {
    next: { revalidate: DEFAULT_REVALIDATE }
  });

  if (!payload?.length) return equities;

  return payload.slice(0, 50).map((row) => ({
    symbol: row.symbol,
    name: row.companyName,
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
    quantScore: 50,
    sentiment: 50
  }));
}

export async function getCryptoMarkets() {
  const payload = await fetchJson<
    Array<{
      symbol: string;
      name: string;
      current_price: number;
      price_change_percentage_24h: number;
      market_cap: number;
      total_volume: number;
      sparkline_in_7d?: { price: number[] };
    }>
  >(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&sparkline=true",
    { next: { revalidate: DEFAULT_REVALIDATE } }
  );

  if (!payload?.length) return cryptoAssets;

  return payload.map((coin, index) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    changePct: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume: coin.total_volume,
    dominance: cryptoAssets[index]?.dominance ?? 0,
    sparkline: coin.sparkline_in_7d?.price.slice(-7) ?? cryptoAssets[index]?.sparkline ?? []
  }));
}

export async function getNews(symbol?: string) {
  const key = process.env.NEWS_API_KEY;
  if (!key) return symbol ? newsItems.filter((item) => item.symbol === symbol) : newsItems;

  const query = symbol ? `${symbol} stock` : "stock market earnings macro";
  const payload = await fetchJson<{
    articles?: Array<{
      source?: { name?: string };
      title?: string;
      url?: string;
      publishedAt?: string;
    }>;
  }>(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=20&apiKey=${key}`,
    { next: { revalidate: Number(process.env.NEWS_CACHE_SECONDS ?? 900) } }
  );

  if (!payload?.articles?.length) return symbol ? newsItems.filter((item) => item.symbol === symbol) : newsItems;

  return payload.articles.map((article, index) => ({
    id: `provider-${index}`,
    source: article.source?.name ?? "NewsAPI",
    title: article.title ?? "Untitled market update",
    symbol: symbol ?? "SPY",
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    sentiment: 0,
    url: article.url ?? "#"
  }));
}

export async function getEconomicCalendar() {
  return economicEvents;
}

export async function getInsiderTrades() {
  return insiderTrades;
}

export async function getCongressTrades() {
  return congressTrades;
}

export async function getAiInsights() {
  return aiInsights;
}
