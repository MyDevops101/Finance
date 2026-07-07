export type MarketIndex = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  breadth?: number;
  volatility?: number;
  sparkline: number[];
};

export type Equity = {
  symbol: string;
  name: string;
  sector: string;
  country: string;
  price: number;
  changePct: number;
  marketCap: number;
  revenueGrowth: number;
  peRatio: number;
  dividendYield: number;
  shortInterest: number;
  beta: number;
  quantScore: number;
  sentiment: number;
};

export type InsiderTrade = {
  executive: string;
  role: string;
  company: string;
  symbol: string;
  side: "Buy" | "Sell";
  shares: number;
  value: number;
  filingDate: string;
};

export type CongressTrade = {
  politician: string;
  chamber: "House" | "Senate";
  party: string;
  asset: string;
  symbol: string;
  sector: string;
  tradeType: "Purchase" | "Sale";
  size: string;
  disclosedDate: string;
  estimatedGainPct: number;
};

export type EtfHolding = {
  symbol: string;
  name: string;
  weight: number;
};

export type Etf = {
  symbol: string;
  name: string;
  category: string;
  assets: number;
  expenseRatio: number;
  dividendYield: number;
  ytdReturn: number;
  holdings: EtfHolding[];
};

export type CryptoAsset = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  marketCap: number;
  volume: number;
  dominance: number;
  sparkline: number[];
};

export type EconomicEvent = {
  date: string;
  country: string;
  event: string;
  importance: "Low" | "Medium" | "High";
  previous: string;
  forecast: string;
  actual?: string;
};

export type NewsItem = {
  id: string;
  source: string;
  title: string;
  symbol: string;
  publishedAt: string;
  sentiment: number;
  url: string;
};

export type PortfolioHolding = {
  symbol: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  lastPrice: number;
  dayChangePct: number;
  beta: number;
};

export type AiInsight = {
  symbol: string;
  stance: "Bullish" | "Bearish" | "Neutral";
  trendScore: number;
  riskScore: number;
  volatilityForecast: number;
  confidence: number;
  rationale: string;
};

export type BacktestPoint = {
  date: string;
  strategy: number;
  benchmark: number;
};

export type BacktestMetrics = {
  cagr: number;
  sharpe: number;
  maxDrawdown: number;
  alpha: number;
  beta: number;
};

export type TimeSeriesPoint = {
  date: string;
  value: number;
  secondary?: number;
};

export type SectorReturn = {
  sector: string;
  oneDay: number;
  oneWeek: number;
  oneMonth: number;
};

export type NavItem = {
  label: string;
  href: string;
};
