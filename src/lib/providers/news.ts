import { newsItems } from "@/lib/mock-data";
import type { NewsItem } from "@/lib/types";
import { fetchJson } from "@/lib/providers/http";

const NEWS_API = process.env.NEWS_API_KEY;
const NEWS_TTL = Number(process.env.NEWS_CACHE_SECONDS ?? 900);

function fallback(symbol?: string): NewsItem[] {
  return symbol ? newsItems.filter((item) => item.symbol === symbol) : newsItems;
}

// GDELT seendate looks like "20260707T091500Z" -> ISO.
function parseGdeltDate(value?: string): string {
  if (!value || value.length < 15) return new Date().toISOString();
  const iso = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function gdeltNews(symbol?: string): Promise<NewsItem[] | null> {
  const query = symbol ? `${symbol} stock` : "(stock market OR earnings OR federal reserve OR macro)";
  const payload = await fetchJson<{
    articles?: Array<{ url: string; title: string; seendate: string; domain: string; sourcecountry?: string }>;
  }>(
    `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=ArtList&maxrecords=24&sort=DateDesc&format=json`,
    { ttlSeconds: NEWS_TTL, timeoutMs: 10000 }
  );
  if (!payload?.articles?.length) return null;
  return payload.articles.map((a, i) => ({
    id: `gdelt-${i}`,
    source: a.domain ?? "GDELT",
    title: a.title ?? "Market update",
    symbol: symbol ?? "MKT",
    publishedAt: parseGdeltDate(a.seendate),
    sentiment: 0,
    url: a.url ?? "#"
  }));
}

async function newsApiNews(symbol?: string): Promise<NewsItem[] | null> {
  if (!NEWS_API) return null;
  const query = symbol ? `${symbol} stock` : "stock market earnings macro";
  const payload = await fetchJson<{
    articles?: Array<{ source?: { name?: string }; title?: string; url?: string; publishedAt?: string }>;
  }>(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=24&apiKey=${NEWS_API}`,
    { ttlSeconds: NEWS_TTL }
  );
  if (!payload?.articles?.length) return null;
  return payload.articles.map((a, i) => ({
    id: `newsapi-${i}`,
    source: a.source?.name ?? "NewsAPI",
    title: a.title ?? "Market update",
    symbol: symbol ?? "MKT",
    publishedAt: a.publishedAt ?? new Date().toISOString(),
    sentiment: 0,
    url: a.url ?? "#"
  }));
}

/** News from GDELT (keyless) first, then NewsAPI (keyed), then mock. */
export async function getNews(symbol?: string): Promise<NewsItem[]> {
  try {
    const gdelt = await gdeltNews(symbol);
    if (gdelt?.length) return gdelt;
    const api = await newsApiNews(symbol);
    if (api?.length) return api;
  } catch {
    // fall through
  }
  return fallback(symbol);
}
