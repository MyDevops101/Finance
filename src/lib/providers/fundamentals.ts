import { equities } from "@/lib/mock-data";
import { fetchJson } from "@/lib/providers/http";

export type StatementLine = { label: string; values: (number | null)[] };

export type FinancialStatements = {
  symbol: string;
  periods: string[];
  income: StatementLine[];
  balance: StatementLine[];
  cashflow: StatementLine[];
  source: string;
};

const FMP = process.env.FMP_API_KEY;

type FmpRow = Record<string, number | string>;

function line(label: string, rows: FmpRow[], key: string): StatementLine {
  return { label, values: rows.map((r) => (typeof r[key] === "number" ? (r[key] as number) : null)) };
}

async function fmpStatement(symbol: string, path: string): Promise<FmpRow[] | null> {
  const rows = await fetchJson<FmpRow[]>(
    `https://financialmodelingprep.com/api/v3/${path}/${encodeURIComponent(symbol)}?period=annual&limit=4&apikey=${FMP}`,
    { ttlSeconds: 86_400 }
  );
  return rows?.length ? rows : null;
}

/** Deterministic mock statements derived from the equity universe. */
function fallbackStatements(symbol: string): FinancialStatements {
  const eq = equities.find((e) => e.symbol === symbol.toUpperCase());
  const base = eq ? eq.marketCap / 6 : 5.0e10;
  const periods = ["2025", "2024", "2023", "2022"];
  const scale = (factor: number) => periods.map((_, i) => Math.round(base * factor * (1 - i * 0.12)));

  const revenue = scale(1);
  const netIncome = scale(0.24);
  return {
    symbol: symbol.toUpperCase(),
    periods,
    income: [
      { label: "Revenue", values: revenue },
      { label: "Gross Profit", values: scale(0.55) },
      { label: "Operating Income", values: scale(0.32) },
      { label: "Net Income", values: netIncome },
      { label: "EPS (diluted)", values: periods.map((_, i) => Number((6.2 * (1 - i * 0.12)).toFixed(2))) }
    ],
    balance: [
      { label: "Total Assets", values: scale(1.8) },
      { label: "Total Liabilities", values: scale(0.9) },
      { label: "Total Equity", values: scale(0.9) },
      { label: "Cash & Equivalents", values: scale(0.28) },
      { label: "Total Debt", values: scale(0.42) }
    ],
    cashflow: [
      { label: "Operating Cash Flow", values: scale(0.36) },
      { label: "Capital Expenditure", values: scale(-0.08) },
      { label: "Free Cash Flow", values: scale(0.28) }
    ],
    source: "mock"
  };
}

/** Income statement, balance sheet, and cash flow from FMP (keyed) or mock. */
export async function getFinancialStatements(symbol: string): Promise<FinancialStatements> {
  if (!FMP) return fallbackStatements(symbol);
  try {
    const [income, balance, cash] = await Promise.all([
      fmpStatement(symbol, "income-statement"),
      fmpStatement(symbol, "balance-sheet-statement"),
      fmpStatement(symbol, "cash-flow-statement")
    ]);
    if (!income || !balance || !cash) return fallbackStatements(symbol);

    const periods = income.map((r) => String(r.calendarYear ?? r.date ?? ""));
    return {
      symbol: symbol.toUpperCase(),
      periods,
      income: [
        line("Revenue", income, "revenue"),
        line("Gross Profit", income, "grossProfit"),
        line("Operating Income", income, "operatingIncome"),
        line("Net Income", income, "netIncome"),
        line("EPS (diluted)", income, "epsdiluted")
      ],
      balance: [
        line("Total Assets", balance, "totalAssets"),
        line("Total Liabilities", balance, "totalLiabilities"),
        line("Total Equity", balance, "totalStockholdersEquity"),
        line("Cash & Equivalents", balance, "cashAndCashEquivalents"),
        line("Total Debt", balance, "totalDebt")
      ],
      cashflow: [
        line("Operating Cash Flow", cash, "operatingCashFlow"),
        line("Capital Expenditure", cash, "capitalExpenditure"),
        line("Free Cash Flow", cash, "freeCashFlow")
      ],
      source: "fmp"
    };
  } catch {
    return fallbackStatements(symbol);
  }
}
