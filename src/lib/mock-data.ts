import type {
  AiInsight,
  BacktestMetrics,
  BacktestPoint,
  CongressTrade,
  CryptoAsset,
  EconomicEvent,
  Equity,
  Etf,
  InsiderTrade,
  MarketIndex,
  NewsItem,
  PortfolioHolding,
  SectorReturn,
  TimeSeriesPoint
} from "@/lib/types";

export const marketIndices: MarketIndex[] = [
  {
    name: "S&P 500",
    symbol: "SPY",
    price: 6128.34,
    change: 32.18,
    changePct: 0.53,
    breadth: 62,
    volatility: 13.4,
    sparkline: [6040, 6068, 6058, 6091, 6088, 6110, 6128]
  },
  {
    name: "Dow Jones",
    symbol: "DIA",
    price: 44924.15,
    change: 88.42,
    changePct: 0.2,
    breadth: 56,
    volatility: 12.1,
    sparkline: [44720, 44798, 44812, 44740, 44866, 44892, 44924]
  },
  {
    name: "Nasdaq",
    symbol: "QQQ",
    price: 20744.09,
    change: 194.77,
    changePct: 0.95,
    breadth: 68,
    volatility: 17.8,
    sparkline: [20380, 20448, 20510, 20502, 20611, 20685, 20744]
  },
  {
    name: "Russell 2000",
    symbol: "IWM",
    price: 2264.88,
    change: -11.36,
    changePct: -0.5,
    breadth: 42,
    volatility: 21.2,
    sparkline: [2298, 2288, 2274, 2281, 2269, 2273, 2265]
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 117842.2,
    change: 1912.1,
    changePct: 1.65,
    volatility: 46.3,
    sparkline: [113400, 114870, 115320, 116140, 115780, 117110, 117842]
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 6420.34,
    change: -38.62,
    changePct: -0.6,
    volatility: 51.9,
    sparkline: [6501, 6478, 6422, 6408, 6388, 6440, 6420]
  },
  {
    name: "VIX",
    symbol: "VIX",
    price: 13.62,
    change: -0.28,
    changePct: -2.01,
    volatility: 13.62,
    sparkline: [14.4, 14.1, 13.9, 14.2, 13.7, 13.8, 13.6]
  }
];

export const sectorReturns: SectorReturn[] = [
  { sector: "Technology", oneDay: 1.28, oneWeek: 2.34, oneMonth: 6.81 },
  { sector: "Financials", oneDay: 0.42, oneWeek: 1.12, oneMonth: 3.04 },
  { sector: "Industrials", oneDay: -0.18, oneWeek: 0.88, oneMonth: 2.55 },
  { sector: "Energy", oneDay: -1.1, oneWeek: -2.06, oneMonth: -3.44 },
  { sector: "Health Care", oneDay: 0.08, oneWeek: -0.4, oneMonth: 1.25 },
  { sector: "Consumer", oneDay: 0.74, oneWeek: 1.77, oneMonth: 4.02 },
  { sector: "Utilities", oneDay: -0.36, oneWeek: 0.2, oneMonth: 1.88 },
  { sector: "Real Estate", oneDay: -0.52, oneWeek: -1.31, oneMonth: 0.48 },
  { sector: "Materials", oneDay: 0.31, oneWeek: 0.56, oneMonth: 2.12 }
];

export const equities: Equity[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    country: "United States",
    price: 178.42,
    changePct: 2.14,
    marketCap: 4380000000000,
    revenueGrowth: 68.2,
    peRatio: 41.8,
    dividendYield: 0.03,
    shortInterest: 1.1,
    beta: 1.68,
    quantScore: 92,
    sentiment: 81
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    country: "United States",
    price: 512.66,
    changePct: 0.84,
    marketCap: 3810000000000,
    revenueGrowth: 15.8,
    peRatio: 35.6,
    dividendYield: 0.64,
    shortInterest: 0.72,
    beta: 0.91,
    quantScore: 88,
    sentiment: 74
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    country: "United States",
    price: 226.19,
    changePct: -0.22,
    marketCap: 3380000000000,
    revenueGrowth: 4.9,
    peRatio: 29.4,
    dividendYield: 0.43,
    shortInterest: 0.86,
    beta: 1.12,
    quantScore: 71,
    sentiment: 59
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer",
    country: "United States",
    price: 219.35,
    changePct: 1.18,
    marketCap: 2330000000000,
    revenueGrowth: 11.4,
    peRatio: 37.2,
    dividendYield: 0,
    shortInterest: 0.91,
    beta: 1.22,
    quantScore: 84,
    sentiment: 76
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financials",
    country: "United States",
    price: 288.12,
    changePct: 0.34,
    marketCap: 805000000000,
    revenueGrowth: 7.7,
    peRatio: 13.5,
    dividendYield: 1.74,
    shortInterest: 0.69,
    beta: 1.06,
    quantScore: 77,
    sentiment: 66
  },
  {
    symbol: "LLY",
    name: "Eli Lilly and Company",
    sector: "Health Care",
    country: "United States",
    price: 914.52,
    changePct: -0.61,
    marketCap: 868000000000,
    revenueGrowth: 27.5,
    peRatio: 58.1,
    dividendYield: 0.56,
    shortInterest: 0.84,
    beta: 0.39,
    quantScore: 79,
    sentiment: 69
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    sector: "Energy",
    country: "United States",
    price: 112.9,
    changePct: -1.44,
    marketCap: 497000000000,
    revenueGrowth: -3.8,
    peRatio: 14.2,
    dividendYield: 3.41,
    shortInterest: 0.92,
    beta: 0.98,
    quantScore: 45,
    sentiment: 38
  },
  {
    symbol: "SHOP",
    name: "Shopify Inc.",
    sector: "Technology",
    country: "Canada",
    price: 94.22,
    changePct: 2.72,
    marketCap: 122000000000,
    revenueGrowth: 24.1,
    peRatio: 62.7,
    dividendYield: 0,
    shortInterest: 2.7,
    beta: 2.16,
    quantScore: 82,
    sentiment: 73
  },
  {
    symbol: "ASML",
    name: "ASML Holding N.V.",
    sector: "Technology",
    country: "Netherlands",
    price: 1040.65,
    changePct: 1.08,
    marketCap: 410000000000,
    revenueGrowth: 9.3,
    peRatio: 38.8,
    dividendYield: 0.77,
    shortInterest: 0.41,
    beta: 1.34,
    quantScore: 80,
    sentiment: 68
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Consumer",
    country: "United States",
    price: 281.7,
    changePct: -1.92,
    marketCap: 898000000000,
    revenueGrowth: 2.4,
    peRatio: 74.5,
    dividendYield: 0,
    shortInterest: 3.2,
    beta: 2.08,
    quantScore: 51,
    sentiment: 42
  }
];

export const insiderTrades: InsiderTrade[] = [
  {
    executive: "Maya Santori",
    role: "CFO",
    company: "Apex Semiconductors",
    symbol: "APX",
    side: "Buy",
    shares: 24000,
    value: 1260000,
    filingDate: "2026-07-02"
  },
  {
    executive: "Daniel Cho",
    role: "Director",
    company: "Northstar Payments",
    symbol: "NSTP",
    side: "Buy",
    shares: 18000,
    value: 842000,
    filingDate: "2026-06-30"
  },
  {
    executive: "Priya Malhotra",
    role: "CEO",
    company: "Helix Therapeutics",
    symbol: "HLXT",
    side: "Sell",
    shares: 9000,
    value: 1510000,
    filingDate: "2026-06-28"
  },
  {
    executive: "Andre Wallace",
    role: "COO",
    company: "Atlas Robotics",
    symbol: "ATRB",
    side: "Buy",
    shares: 32000,
    value: 620000,
    filingDate: "2026-06-27"
  },
  {
    executive: "Elena Torres",
    role: "Director",
    company: "Cobalt Grid",
    symbol: "CBLT",
    side: "Sell",
    shares: 15000,
    value: 735000,
    filingDate: "2026-06-26"
  }
];

export const congressTrades: CongressTrade[] = [
  {
    politician: "Sen. Margaret Ellison",
    chamber: "Senate",
    party: "I",
    asset: "Cybersecurity ETF",
    symbol: "HACK",
    sector: "Technology",
    tradeType: "Purchase",
    size: "$50k-$100k",
    disclosedDate: "2026-06-24",
    estimatedGainPct: 4.8
  },
  {
    politician: "Rep. Thomas Reed",
    chamber: "House",
    party: "R",
    asset: "JPMorgan Chase",
    symbol: "JPM",
    sector: "Financials",
    tradeType: "Purchase",
    size: "$15k-$50k",
    disclosedDate: "2026-06-21",
    estimatedGainPct: 2.2
  },
  {
    politician: "Rep. Alana Brooks",
    chamber: "House",
    party: "D",
    asset: "Exxon Mobil",
    symbol: "XOM",
    sector: "Energy",
    tradeType: "Sale",
    size: "$100k-$250k",
    disclosedDate: "2026-06-18",
    estimatedGainPct: -1.4
  },
  {
    politician: "Sen. Victor Han",
    chamber: "Senate",
    party: "D",
    asset: "Microsoft",
    symbol: "MSFT",
    sector: "Technology",
    tradeType: "Purchase",
    size: "$250k-$500k",
    disclosedDate: "2026-06-12",
    estimatedGainPct: 6.1
  }
];

export const etfs: Etf[] = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    category: "Large Cap Blend",
    assets: 548000000000,
    expenseRatio: 0.09,
    dividendYield: 1.22,
    ytdReturn: 13.8,
    holdings: [
      { symbol: "NVDA", name: "NVIDIA", weight: 7.9 },
      { symbol: "MSFT", name: "Microsoft", weight: 6.8 },
      { symbol: "AAPL", name: "Apple", weight: 6.2 }
    ]
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    category: "Large Cap Growth",
    assets: 322000000000,
    expenseRatio: 0.2,
    dividendYield: 0.62,
    ytdReturn: 18.4,
    holdings: [
      { symbol: "NVDA", name: "NVIDIA", weight: 9.6 },
      { symbol: "MSFT", name: "Microsoft", weight: 8.2 },
      { symbol: "AVGO", name: "Broadcom", weight: 5.7 }
    ]
  },
  {
    symbol: "IWM",
    name: "iShares Russell 2000 ETF",
    category: "Small Cap Blend",
    assets: 73500000000,
    expenseRatio: 0.19,
    dividendYield: 1.39,
    ytdReturn: 4.2,
    holdings: [
      { symbol: "FTAI", name: "FTAI Aviation", weight: 0.56 },
      { symbol: "INSM", name: "Insmed", weight: 0.44 },
      { symbol: "SFM", name: "Sprouts Farmers Market", weight: 0.42 }
    ]
  }
];

export const cryptoAssets: CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 117842.2,
    changePct: 1.65,
    marketCap: 2320000000000,
    volume: 62100000000,
    dominance: 54.2,
    sparkline: [113400, 114870, 115320, 116140, 115780, 117110, 117842]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 6420.34,
    changePct: -0.6,
    marketCap: 774000000000,
    volume: 28400000000,
    dominance: 18.1,
    sparkline: [6501, 6478, 6422, 6408, 6388, 6440, 6420]
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 251.94,
    changePct: 3.22,
    marketCap: 128000000000,
    volume: 8100000000,
    dominance: 3.1,
    sparkline: [232, 238, 244, 241, 247, 249, 252]
  }
];

export const economicEvents: EconomicEvent[] = [
  {
    date: "2026-07-09",
    country: "United States",
    event: "Initial Jobless Claims",
    importance: "Medium",
    previous: "224k",
    forecast: "221k"
  },
  {
    date: "2026-07-10",
    country: "United States",
    event: "Core CPI YoY",
    importance: "High",
    previous: "2.8%",
    forecast: "2.7%"
  },
  {
    date: "2026-07-15",
    country: "United States",
    event: "Retail Sales MoM",
    importance: "High",
    previous: "0.4%",
    forecast: "0.2%"
  },
  {
    date: "2026-07-17",
    country: "Euro Area",
    event: "ECB Deposit Rate",
    importance: "High",
    previous: "2.25%",
    forecast: "2.25%"
  }
];

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    source: "SEC Daily",
    title: "Large-cap semiconductors see renewed institutional accumulation",
    symbol: "NVDA",
    publishedAt: "2026-07-07T09:15:00Z",
    sentiment: 0.78,
    url: "https://www.sec.gov/"
  },
  {
    id: "n2",
    source: "Macro Brief",
    title: "Yield curve steepens as rate-cut expectations drift lower",
    symbol: "SPY",
    publishedAt: "2026-07-07T08:40:00Z",
    sentiment: -0.18,
    url: "https://fred.stlouisfed.org/"
  },
  {
    id: "n3",
    source: "Crypto Market Desk",
    title: "Bitcoin liquidity improves after weekend derivatives reset",
    symbol: "BTC",
    publishedAt: "2026-07-07T07:05:00Z",
    sentiment: 0.44,
    url: "https://www.coingecko.com/"
  },
  {
    id: "n4",
    source: "Policy Watch",
    title: "Congressional disclosures show rotation into cybersecurity",
    symbol: "HACK",
    publishedAt: "2026-07-06T19:30:00Z",
    sentiment: 0.36,
    url: "https://disclosures-clerk.house.gov/"
  }
];

export const portfolioHoldings: PortfolioHolding[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    shares: 90,
    avgCost: 141.22,
    lastPrice: 178.42,
    dayChangePct: 2.14,
    beta: 1.68
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    shares: 42,
    avgCost: 438.1,
    lastPrice: 512.66,
    dayChangePct: 0.84,
    beta: 0.91
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financials",
    shares: 70,
    avgCost: 243.4,
    lastPrice: 288.12,
    dayChangePct: 0.34,
    beta: 1.06
  },
  {
    symbol: "LLY",
    name: "Eli Lilly and Company",
    sector: "Health Care",
    shares: 16,
    avgCost: 794.8,
    lastPrice: 914.52,
    dayChangePct: -0.61,
    beta: 0.39
  }
];

export const aiInsights: AiInsight[] = [
  {
    symbol: "NVDA",
    stance: "Bullish",
    trendScore: 92,
    riskScore: 44,
    volatilityForecast: 31,
    confidence: 86,
    rationale:
      "Momentum, earnings revisions, insider net buying in peers, and positive semiconductor news sentiment remain aligned."
  },
  {
    symbol: "XOM",
    stance: "Bearish",
    trendScore: 36,
    riskScore: 61,
    volatilityForecast: 24,
    confidence: 72,
    rationale:
      "Energy momentum has weakened while congressional and ETF flows show lower near-term sponsorship."
  },
  {
    symbol: "JPM",
    stance: "Neutral",
    trendScore: 58,
    riskScore: 49,
    volatilityForecast: 18,
    confidence: 63,
    rationale:
      "Quality and valuation are constructive, but macro sensitivity caps the signal until CPI and Fed repricing settle."
  }
];

export const performanceStats = [
  { label: "Signals tracked", value: "4.8M" },
  { label: "Public filings parsed", value: "1.2M" },
  { label: "Median API latency", value: "142ms" },
  { label: "Coverage universe", value: "18k+" }
];

export const testimonials = [
  {
    quote:
      "The best thing about Quiver is that it compresses alternative data into something our analysts can actually act on.",
    name: "Evelyn Carter",
    role: "Portfolio Manager"
  },
  {
    quote:
      "The research lab gives our team a clean first pass before we decide which signals deserve deeper testing.",
    name: "Noah Stein",
    role: "Quant Research Lead"
  },
  {
    quote:
      "Congressional and insider flows sitting beside fundamentals changed how quickly we triage new ideas.",
    name: "Iris Coleman",
    role: "Equity Analyst"
  }
];

export const backtestSeries: BacktestPoint[] = [
  { date: "2025-08", strategy: 100, benchmark: 100 },
  { date: "2025-09", strategy: 104, benchmark: 102 },
  { date: "2025-10", strategy: 107, benchmark: 103 },
  { date: "2025-11", strategy: 101, benchmark: 99 },
  { date: "2025-12", strategy: 111, benchmark: 105 },
  { date: "2026-01", strategy: 118, benchmark: 109 },
  { date: "2026-02", strategy: 115, benchmark: 108 },
  { date: "2026-03", strategy: 124, benchmark: 111 },
  { date: "2026-04", strategy: 132, benchmark: 116 },
  { date: "2026-05", strategy: 137, benchmark: 119 },
  { date: "2026-06", strategy: 145, benchmark: 123 },
  { date: "2026-07", strategy: 151, benchmark: 126 }
];

export const defaultBacktestMetrics: BacktestMetrics = {
  cagr: 38.4,
  sharpe: 1.82,
  maxDrawdown: -9.7,
  alpha: 12.6,
  beta: 0.94
};

export const macroSeries: TimeSeriesPoint[] = [
  { date: "Jan", value: 4.14, secondary: 2.95 },
  { date: "Feb", value: 4.21, secondary: 2.91 },
  { date: "Mar", value: 4.18, secondary: 2.86 },
  { date: "Apr", value: 4.07, secondary: 2.79 },
  { date: "May", value: 4.02, secondary: 2.74 },
  { date: "Jun", value: 3.96, secondary: 2.7 },
  { date: "Jul", value: 3.9, secondary: 2.68 }
];

export const sentimentSeries: TimeSeriesPoint[] = [
  { date: "Mon", value: 55, secondary: 18 },
  { date: "Tue", value: 62, secondary: 16 },
  { date: "Wed", value: 69, secondary: 13 },
  { date: "Thu", value: 64, secondary: 22 },
  { date: "Fri", value: 72, secondary: 14 },
  { date: "Sat", value: 68, secondary: 17 },
  { date: "Sun", value: 76, secondary: 11 }
];

export const congressionalFlowSeries: TimeSeriesPoint[] = [
  { date: "Feb", value: 28, secondary: 17 },
  { date: "Mar", value: 35, secondary: 24 },
  { date: "Apr", value: 42, secondary: 19 },
  { date: "May", value: 31, secondary: 26 },
  { date: "Jun", value: 48, secondary: 21 },
  { date: "Jul", value: 54, secondary: 18 }
];
