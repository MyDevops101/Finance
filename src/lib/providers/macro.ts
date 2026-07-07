import { macroSeries } from "@/lib/mock-data";
import type { TimeSeriesPoint } from "@/lib/types";
import { fetchJson } from "@/lib/providers/http";

export type MacroIndicator = {
  id: string;
  label: string;
  unit: string;
  latest: number;
  previous: number;
  change: number;
  series: { date: string; value: number }[];
};

const FRED = process.env.FRED_API_KEY;

// FRED series ids for the macro dashboard.
const SERIES: Array<{ id: string; label: string; unit: string }> = [
  { id: "DGS10", label: "10Y Treasury Yield", unit: "%" },
  { id: "DGS2", label: "2Y Treasury Yield", unit: "%" },
  { id: "FEDFUNDS", label: "Fed Funds Rate", unit: "%" },
  { id: "CPILFESL", label: "Core CPI (Index)", unit: "idx" },
  { id: "UNRATE", label: "Unemployment Rate", unit: "%" },
  { id: "T10Y2Y", label: "10Y-2Y Spread", unit: "%" }
];

// Approximate fallback levels so the dashboard renders without a FRED key.
const FALLBACK: Record<string, number> = {
  DGS10: 3.9,
  DGS2: 3.62,
  FEDFUNDS: 4.33,
  CPILFESL: 322.4,
  UNRATE: 4.1,
  T10Y2Y: 0.28
};

async function fredSeries(id: string): Promise<{ date: string; value: number }[] | null> {
  const payload = await fetchJson<{ observations?: Array<{ date: string; value: string }> }>(
    `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${FRED}&file_type=json&sort_order=desc&limit=24`,
    { ttlSeconds: 3600 }
  );
  if (!payload?.observations?.length) return null;
  return payload.observations
    .map((o) => ({ date: o.date, value: Number(o.value) }))
    .filter((o) => !Number.isNaN(o.value))
    .reverse();
}

function fallbackSeries(id: string): { date: string; value: number }[] {
  const base = FALLBACK[id] ?? 1;
  return Array.from({ length: 12 }, (_, i) => ({
    date: new Date(Date.now() - (11 - i) * 30 * 86_400_000).toISOString().slice(0, 10),
    value: Number((base * (0.97 + (i / 11) * 0.06)).toFixed(2))
  }));
}

export async function getMacroDashboard(): Promise<MacroIndicator[]> {
  const results = await Promise.all(
    SERIES.map(async (s) => {
      let series: { date: string; value: number }[] | null = null;
      if (FRED) {
        try {
          series = await fredSeries(s.id);
        } catch {
          series = null;
        }
      }
      if (!series?.length) series = fallbackSeries(s.id);
      const latest = series[series.length - 1]?.value ?? 0;
      const previous = series[series.length - 2]?.value ?? latest;
      return {
        id: s.id,
        label: s.label,
        unit: s.unit,
        latest,
        previous,
        change: Number((latest - previous).toFixed(2)),
        series
      };
    })
  );
  return results;
}

/** Combined 10Y yield vs Core CPI series for the dashboard macro chart. */
export async function getMacroChart(): Promise<TimeSeriesPoint[]> {
  if (!FRED) return macroSeries;
  try {
    const [tenY, cpi] = await Promise.all([fredSeries("DGS10"), fredSeries("CPILFESL")]);
    if (!tenY?.length) return macroSeries;
    return tenY.slice(-12).map((point, i) => ({
      date: point.date.slice(5),
      value: point.value,
      secondary: cpi?.slice(-12)[i]?.value
    }));
  } catch {
    return macroSeries;
  }
}
