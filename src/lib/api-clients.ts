/**
 * Public data facade. Every function returns live data when a source is
 * reachable (and its API key, if any, is configured) and otherwise falls back
 * to deterministic mock data so the app always renders. Individual source
 * adapters live in `src/lib/providers/`.
 */
import { aiInsights, congressTrades, economicEvents, marketIndices } from "@/lib/mock-data";
import type { MarketIndex } from "@/lib/types";

import { getCryptoMarkets } from "@/lib/providers/crypto";
import { getQuotes } from "@/lib/providers/quotes";

export { getCryptoMarkets, getCryptoGlobal } from "@/lib/providers/crypto";
export { getFxRates } from "@/lib/providers/fx";
export { getNews } from "@/lib/providers/news";
export { getScreenerUniverse } from "@/lib/providers/screener";
export { getQuote, getQuotes } from "@/lib/providers/quotes";
export { getCandles } from "@/lib/providers/candles";
export { getFinancialStatements } from "@/lib/providers/fundamentals";
export { getEarningsCalendar } from "@/lib/providers/earnings";
export { getFilings, getInsiderFilings } from "@/lib/providers/sec";
export { getMacroDashboard, getMacroChart } from "@/lib/providers/macro";
export { getOptionsChain } from "@/lib/providers/options";
export { getProviderStatus } from "@/lib/providers/status";

/**
 * Live market overview: real quotes for the major index ETFs (via the quote
 * provider chain) and live BTC/ETH from CoinGecko, merged onto the mock index
 * rows so breadth/volatility/sparkline styling is preserved.
 */
export async function getMarketOverview(): Promise<MarketIndex[]> {
  const stockSymbols = ["SPY", "DIA", "QQQ", "IWM"];
  const [quotes, crypto] = await Promise.all([getQuotes(stockSymbols), getCryptoMarkets()]);
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));
  const cryptoMap = new Map(crypto.map((c) => [c.symbol, c]));

  return marketIndices.map((index) => {
    const quote = quoteMap.get(index.symbol);
    if (quote && quote.source !== "mock") {
      return { ...index, price: quote.price, change: quote.change, changePct: quote.changePct };
    }
    const coin = cryptoMap.get(index.symbol);
    if (coin) {
      return {
        ...index,
        price: coin.price,
        change: (coin.price * coin.changePct) / 100,
        changePct: coin.changePct,
        sparkline: coin.sparkline.length ? coin.sparkline : index.sparkline
      };
    }
    return index;
  });
}

export async function getEconomicCalendar() {
  return economicEvents;
}

export async function getInsiderTrades() {
  const { insiderTrades } = await import("@/lib/mock-data");
  return insiderTrades;
}

export async function getCongressTrades() {
  return congressTrades;
}

export async function getAiInsights() {
  return aiInsights;
}
