import { fetchJson } from "@/lib/providers/http";
import { getQuote } from "@/lib/providers/quotes";

export type OptionRow = {
  strike: number;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  iv: number;
};

export type OptionsChain = {
  symbol: string;
  expiration: string;
  underlyingPrice: number;
  calls: OptionRow[];
  puts: OptionRow[];
  source: string;
};

const TRADIER = process.env.TRADIER_API_KEY;
const TRADIER_BASE = process.env.TRADIER_BASE_URL ?? "https://sandbox.tradier.com/v1";

function nextMonthlyExpiration(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  // Third Friday-ish; good enough for a synthetic label.
  d.setDate(15 + ((5 - new Date(d.getFullYear(), d.getMonth(), 15).getDay() + 7) % 7));
  return d.toISOString().slice(0, 10);
}

function round(n: number, dp = 2) {
  return Number(n.toFixed(dp));
}

/** Synthetic chain around the live/mock underlying price. */
function syntheticChain(symbol: string, price: number): OptionsChain {
  const step = price > 500 ? 10 : price > 100 ? 5 : price > 20 ? 2.5 : 1;
  const atm = Math.round(price / step) * step;
  const strikes = Array.from({ length: 11 }, (_, i) => round(atm + (i - 5) * step));

  const build = (isCall: boolean): OptionRow[] =>
    strikes.map((strike) => {
      const intrinsic = isCall ? Math.max(0, price - strike) : Math.max(0, strike - price);
      const distance = Math.abs(strike - price) / price;
      const time = price * 0.04 * Math.exp(-distance * 6);
      const mid = round(intrinsic + time);
      return {
        strike,
        bid: round(Math.max(0.01, mid - 0.15)),
        ask: round(mid + 0.15),
        last: mid,
        volume: Math.round(2000 * Math.exp(-distance * 8)),
        openInterest: Math.round(9000 * Math.exp(-distance * 5)),
        iv: round(0.25 + distance * 0.9, 3)
      };
    });

  return {
    symbol: symbol.toUpperCase(),
    expiration: nextMonthlyExpiration(),
    underlyingPrice: round(price),
    calls: build(true),
    puts: build(false),
    source: "synthetic"
  };
}

type TradierOption = {
  strike: number;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  open_interest: number;
  option_type: "call" | "put";
  greeks?: { mid_iv?: number };
};

export async function getOptionsChain(symbol: string, expiration?: string): Promise<OptionsChain> {
  const sym = symbol.toUpperCase();
  const quote = await getQuote(sym);

  if (!TRADIER) return syntheticChain(sym, quote.price);

  try {
    let exp = expiration;
    if (!exp) {
      const expData = await fetchJson<{ expirations?: { date?: string[] } }>(
        `${TRADIER_BASE}/markets/options/expirations?symbol=${sym}`,
        { ttlSeconds: 3600, headers: { Authorization: `Bearer ${TRADIER}`, Accept: "application/json" } }
      );
      exp = expData?.expirations?.date?.[0];
    }
    if (!exp) return syntheticChain(sym, quote.price);

    const chain = await fetchJson<{ options?: { option?: TradierOption[] } }>(
      `${TRADIER_BASE}/markets/options/chains?symbol=${sym}&expiration=${exp}&greeks=true`,
      { ttlSeconds: 120, headers: { Authorization: `Bearer ${TRADIER}`, Accept: "application/json" } }
    );
    const options = chain?.options?.option;
    if (!options?.length) return syntheticChain(sym, quote.price);

    const map = (o: TradierOption): OptionRow => ({
      strike: o.strike,
      bid: o.bid ?? 0,
      ask: o.ask ?? 0,
      last: o.last ?? 0,
      volume: o.volume ?? 0,
      openInterest: o.open_interest ?? 0,
      iv: o.greeks?.mid_iv ?? 0
    });

    return {
      symbol: sym,
      expiration: exp,
      underlyingPrice: quote.price,
      calls: options.filter((o) => o.option_type === "call").map(map),
      puts: options.filter((o) => o.option_type === "put").map(map),
      source: "tradier"
    };
  } catch {
    return syntheticChain(sym, quote.price);
  }
}
