import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Database, Landmark, ShieldCheck, UserRoundSearch } from "lucide-react";

import { BacktestChart } from "@/components/charts/backtest-chart";
import { HeroScene } from "@/components/landing/hero-scene";
import { MarketTicker } from "@/components/market/market-ticker";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { backtestSeries, performanceStats, testimonials } from "@/lib/mock-data";

const productModules = [
  {
    title: "Insider Trading Tracker",
    description: "Parse SEC Form 4 activity and isolate executive buying clusters.",
    icon: UserRoundSearch
  },
  {
    title: "Congressional Trading Tracker",
    description: "Track disclosures by politician, sector, size, timing, and estimated performance.",
    icon: Landmark
  },
  {
    title: "Quant Research Lab",
    description: "Backtest momentum, RSI, MACD, moving average, and factor strategies.",
    icon: BarChart3
  },
  {
    title: "AI Insights",
    description: "Generate confidence-scored bullish, bearish, trend, volatility, and risk signals.",
    icon: BrainCircuit
  },
  {
    title: "Public Data Engine",
    description: "Unify SEC EDGAR, FRED, CoinGecko, NewsAPI, GNews, FMP, and Alpha Vantage.",
    icon: Database
  },
  {
    title: "Portfolio Risk",
    description: "Monitor allocation, beta, correlation, drawdown risk, and market sensitivity.",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Eagle Quantitative",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    description:
      "Alternative data and quantitative research platform for market intelligence, insider trading, congressional disclosures, macro data, sentiment, and portfolio analytics."
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main>
        <section className="relative min-h-[82vh] overflow-hidden">
          <HeroScene />
          <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6">
            <Badge variant="accent" className="w-fit">Institutional market intelligence</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Alternative Data Meets Quantitative Intelligence
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover market-moving signals from insider trading, congressional disclosures, macroeconomic trends, and AI-powered quantitative models.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard">
                  Start Free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <MarketTicker />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {performanceStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-[#080C14]/80">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Badge>Product showcase</Badge>
              <h2 className="mt-4 text-3xl font-bold text-white">One research cockpit for public and alternative data.</h2>
              <p className="mt-4 leading-7 text-muted">
                Eagle brings screening, filings intelligence, macro calendars, sentiment, portfolios, and backtesting into a single analyst workflow.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {productModules.slice(0, 4).map((module) => {
                  const Icon = module.icon;
                  return (
                    <div key={module.title} className="rounded-lg border border-border bg-white/5 p-4">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <div className="mt-3 text-sm font-semibold text-white">{module.title}</div>
                      <p className="mt-2 text-sm leading-6 text-muted">{module.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Momentum + Quality Backtest</div>
                    <div className="text-xs text-muted">Strategy versus benchmark</div>
                  </div>
                  <Badge variant="success">Sharpe 1.82</Badge>
                </div>
                <div className="h-80">
                  <BacktestChart data={backtestSeries} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {productModules.slice(3).map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.title}>
                  <CardContent className="p-5">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{module.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{module.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border bg-[#080C14]/80">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <Badge variant="accent">Trusted workflow</Badge>
                <h2 className="mt-3 text-3xl font-bold text-white">Built for analysts who move fast.</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="p-5">
                    <p className="leading-7 text-slate-300">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-5">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-muted">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="rounded-lg border border-primary/25 bg-primary/10 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Turn public market data into testable investment signals.</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              Start with the dashboard, then move into screeners, filings, sentiment, and research without changing tools.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/dashboard">
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}

