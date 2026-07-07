import { fetchJson } from "@/lib/providers/http";

export type EarningsEvent = {
  symbol: string;
  date: string;
  hour: string;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
};

const FINNHUB = process.env.FINNHUB_API_KEY;

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

// Deterministic mock earnings for the next two weeks.
function fallbackEarnings(): EarningsEvent[] {
  const rows: Array<[string, number, number]> = [
    ["JPM", 1, 4.42],
    ["NFLX", 3, 5.18],
    ["TSLA", 5, 0.72],
    ["MSFT", 8, 3.35],
    ["META", 8, 5.61],
    ["AAPL", 10, 1.54],
    ["AMZN", 12, 1.28],
    ["NVDA", 14, 0.88]
  ];
  return rows.map(([symbol, day, eps]) => ({
    symbol,
    date: isoDaysFromNow(day),
    hour: day % 2 === 0 ? "amc" : "bmo",
    epsEstimate: eps,
    epsActual: null,
    revenueEstimate: null,
    revenueActual: null
  }));
}

/** Earnings calendar for the next `days` days from Finnhub (keyed) or mock. */
export async function getEarningsCalendar(days = 14): Promise<EarningsEvent[]> {
  if (!FINNHUB) return fallbackEarnings();
  try {
    const payload = await fetchJson<{
      earningsCalendar?: Array<{
        symbol: string;
        date: string;
        hour: string;
        epsEstimate: number | null;
        epsActual: number | null;
        revenueEstimate: number | null;
        revenueActual: number | null;
      }>;
    }>(
      `https://finnhub.io/api/v1/calendar/earnings?from=${isoDaysFromNow(0)}&to=${isoDaysFromNow(days)}&token=${FINNHUB}`,
      { ttlSeconds: 3600 }
    );
    const rows = payload?.earningsCalendar;
    if (!rows?.length) return fallbackEarnings();
    return rows.slice(0, 40).map((r) => ({
      symbol: r.symbol,
      date: r.date,
      hour: r.hour || "--",
      epsEstimate: r.epsEstimate,
      epsActual: r.epsActual,
      revenueEstimate: r.revenueEstimate,
      revenueActual: r.revenueActual
    }));
  } catch {
    return fallbackEarnings();
  }
}
