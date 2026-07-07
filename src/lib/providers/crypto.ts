import { cryptoAssets } from "@/lib/mock-data";
import type { CryptoAsset } from "@/lib/types";
import { fetchJson, withFallback } from "@/lib/providers/http";

const COINGECKO = "https://api.coingecko.com/api/v3";

type CoinMarket = {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
};

/**
 * Live crypto markets from CoinGecko (keyless, no API key required).
 * Falls back to mock data if the API is unreachable.
 */
export async function getCryptoMarkets(): Promise<CryptoAsset[]> {
  return withFallback(async () => {
    const ids = "bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,avalanche-2";
    const rows = await fetchJson<CoinMarket[]>(
      `${COINGECKO}/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=24h`,
      { ttlSeconds: 120 }
    );
    if (!rows?.length) return null;

    const global = await getGlobalDominance();

    return rows.map((coin, index) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      changePct: coin.price_change_percentage_24h ?? 0,
      marketCap: coin.market_cap ?? 0,
      volume: coin.total_volume ?? 0,
      dominance: global[coin.symbol.toLowerCase()] ?? cryptoAssets[index]?.dominance ?? 0,
      sparkline: coin.sparkline_in_7d?.price?.slice(-24) ?? cryptoAssets[index]?.sparkline ?? []
    }));
  }, cryptoAssets);
}

type GlobalResponse = {
  data?: { market_cap_percentage?: Record<string, number> };
};

async function getGlobalDominance(): Promise<Record<string, number>> {
  const payload = await fetchJson<GlobalResponse>(`${COINGECKO}/global`, { ttlSeconds: 600 });
  return payload?.data?.market_cap_percentage ?? {};
}

export type CryptoGlobal = {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCoins: number;
};

export async function getCryptoGlobal(): Promise<CryptoGlobal | null> {
  const payload = await fetchJson<{
    data?: {
      total_market_cap?: { usd?: number };
      total_volume?: { usd?: number };
      market_cap_percentage?: { btc?: number };
      active_cryptocurrencies?: number;
    };
  }>(`${COINGECKO}/global`, { ttlSeconds: 600 });

  if (!payload?.data) return null;
  return {
    totalMarketCap: payload.data.total_market_cap?.usd ?? 0,
    totalVolume: payload.data.total_volume?.usd ?? 0,
    btcDominance: payload.data.market_cap_percentage?.btc ?? 0,
    activeCoins: payload.data.active_cryptocurrencies ?? 0
  };
}
