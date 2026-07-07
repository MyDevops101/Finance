import { fetchJson, SEC_USER_AGENT } from "@/lib/providers/http";

export type SecFiling = {
  symbol: string;
  company: string;
  form: string;
  filedAt: string;
  reportDate: string;
  accession: string;
  url: string;
  description: string;
};

const HEADERS = { "User-Agent": SEC_USER_AGENT, Accept: "application/json" };

// A small watchlist used to aggregate recent insider (Form 3/4/5) activity
// across the market for the Insiders module.
const INSIDER_UNIVERSE = ["AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "JPM", "META", "GOOGL"];

type TickerMap = Record<string, { cik_str: number; ticker: string; title: string }>;

let tickerCache: Record<string, { cik: string; title: string }> | null = null;

async function loadTickerMap(): Promise<Record<string, { cik: string; title: string }> | null> {
  if (tickerCache) return tickerCache;
  const raw = await fetchJson<TickerMap>("https://www.sec.gov/files/company_tickers.json", {
    ttlSeconds: 86_400,
    headers: HEADERS
  });
  if (!raw) return null;
  const map: Record<string, { cik: string; title: string }> = {};
  for (const key of Object.keys(raw)) {
    const row = raw[key];
    map[row.ticker.toUpperCase()] = {
      cik: String(row.cik_str).padStart(10, "0"),
      title: row.title
    };
  }
  tickerCache = map;
  return map;
}

const FORM_DESCRIPTIONS: Record<string, string> = {
  "10-K": "Annual report",
  "10-Q": "Quarterly report",
  "8-K": "Material event",
  "4": "Insider transaction (Form 4)",
  "3": "Initial insider ownership (Form 3)",
  "5": "Annual insider statement (Form 5)",
  "13F-HR": "Institutional holdings",
  "S-1": "Registration statement",
  DEF14A: "Proxy statement"
};

type Submissions = {
  name?: string;
  filings?: {
    recent?: {
      accessionNumber: string[];
      form: string[];
      filingDate: string[];
      reportDate: string[];
      primaryDocument: string[];
    };
  };
};

async function fetchCompanyFilings(
  symbol: string,
  cik: string,
  title: string,
  forms?: string[],
  limit = 20
): Promise<SecFiling[]> {
  const data = await fetchJson<Submissions>(`https://data.sec.gov/submissions/CIK${cik}.json`, {
    ttlSeconds: 1800,
    headers: HEADERS
  });
  const recent = data?.filings?.recent;
  if (!recent) return [];

  const cikTrimmed = String(Number(cik));
  const out: SecFiling[] = [];
  for (let i = 0; i < recent.form.length && out.length < limit; i += 1) {
    const form = recent.form[i];
    if (forms && !forms.includes(form)) continue;
    const accession = recent.accessionNumber[i];
    const folder = accession.replace(/-/g, "");
    const doc = recent.primaryDocument[i];
    out.push({
      symbol,
      company: data?.name ?? title,
      form,
      filedAt: recent.filingDate[i],
      reportDate: recent.reportDate[i] || recent.filingDate[i],
      accession,
      url: doc
        ? `https://www.sec.gov/Archives/edgar/data/${cikTrimmed}/${folder}/${doc}`
        : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=&dateb=&owner=include&count=40`,
      description: FORM_DESCRIPTIONS[form] ?? form
    });
  }
  return out;
}

/** Live filings for a single ticker (optionally filtered by form type). */
export async function getFilings(symbol: string, forms?: string[], limit = 20): Promise<SecFiling[]> {
  try {
    const map = await loadTickerMap();
    const entry = map?.[symbol.toUpperCase()];
    if (!entry) return [];
    return await fetchCompanyFilings(symbol.toUpperCase(), entry.cik, entry.title, forms, limit);
  } catch {
    return [];
  }
}

/** Aggregate recent insider (Form 3/4/5) filings across the insider universe. */
export async function getInsiderFilings(limit = 24): Promise<SecFiling[]> {
  try {
    const map = await loadTickerMap();
    if (!map) return [];
    const all: SecFiling[] = [];
    for (const symbol of INSIDER_UNIVERSE) {
      const entry = map[symbol];
      if (!entry) continue;
      const filings = await fetchCompanyFilings(symbol, entry.cik, entry.title, ["4", "3", "5"], 6);
      all.push(...filings);
    }
    return all
      .sort((a, b) => (a.filedAt < b.filedAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}
