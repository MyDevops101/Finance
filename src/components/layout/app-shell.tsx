import Link from "next/link";
import {
  BarChart3,
  Bot,
  CalendarDays,
  ChevronRight,
  FileText,
  FlaskConical,
  Fuel,
  Gauge,
  Globe2,
  Grid3x3,
  Landmark,
  LineChart,
  Layers,
  Newspaper,
  PieChart,
  Search,
  ShieldCheck,
  UserRoundSearch,
  WalletCards
} from "lucide-react";

import { MarketTicker } from "@/components/market/market-ticker";
import { TerminalClock } from "@/components/layout/terminal-clock";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/components/layout/nav-data";

const icons = {
  Dashboard: Gauge,
  Market: LineChart,
  Financials: FileText,
  Options: Layers,
  Macro: Globe2,
  Screener: Search,
  Insiders: UserRoundSearch,
  Congress: Landmark,
  ETFs: PieChart,
  Crypto: BarChart3,
  Commodities: Fuel,
  Calendar: CalendarDays,
  News: Newspaper,
  Portfolio: WalletCards,
  Factors: Grid3x3,
  Research: ShieldCheck,
  Notebook: FlaskConical,
  "AI Insights": Bot
};

const codes: Record<string, string> = {
  Dashboard: "DASH",
  Market: "MKT",
  Financials: "FA",
  Options: "OMON",
  Macro: "ECOF",
  Screener: "EQS",
  Insiders: "INSD",
  Congress: "GOVT",
  ETFs: "ETF",
  Crypto: "CRYP",
  Commodities: "CMDTY",
  Calendar: "ECO",
  News: "NWS",
  Portfolio: "PORT",
  Factors: "FCTR",
  Research: "BT",
  Notebook: "NB",
  "AI Insights": "AI"
};

const functionKeys = [
  { label: "Help", href: "/dashboard", tone: "text-fn-green" },
  { label: "Equity", href: "/market", tone: "text-primary" },
  { label: "Govt", href: "/congress", tone: "text-primary" },
  { label: "Crypto", href: "/crypto", tone: "text-primary" },
  { label: "Cmdty", href: "/etfs", tone: "text-primary" },
  { label: "News", href: "/news", tone: "text-primary" },
  { label: "Port", href: "/portfolio", tone: "text-primary" },
  { label: "Screen", href: "/screener", tone: "text-primary" },
  { label: "Menu", href: "/dashboard", tone: "text-fn-red" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-mono text-foreground">
      {/* Command bar */}
      <div className="sticky top-0 z-30">
        <header className="flex h-10 items-center gap-3 border-b border-primary/40 bg-black px-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center border border-primary/50 bg-primary/10 text-primary">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Eagle</span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted sm:inline">
              Quantitative Terminal
            </span>
          </Link>

          <div className="flex flex-1 items-center gap-2">
            <div className="flex h-6 min-w-0 flex-1 items-center gap-2 border border-border bg-[#0a0c0f] px-2">
              <span className="text-primary">&gt;</span>
              <input
                aria-label="Command"
                placeholder="ENTER COMMAND <GO>"
                className="h-full w-full bg-transparent text-[11px] uppercase tracking-wider text-foreground outline-none placeholder:text-muted/70"
              />
              <span className="hidden text-[10px] font-bold text-primary sm:inline">&lt;GO&gt;</span>
            </div>
          </div>

          <TerminalClock />

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/api/auth/signin">Sign in</Link>
            </Button>
          </div>
        </header>

        {/* Function key strip */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-black px-3 py-1 scrollbar-thin">
          {functionKeys.map((key, i) => (
            <Link key={key.label} href={key.href} className="fn-key">
              <span className="text-muted">F{i + 1}</span>
              <span className={key.tone}>{key.label}</span>
            </Link>
          ))}
        </div>

        {/* Ticker */}
        <MarketTicker />
      </div>

      <div className="flex">
        {/* Sidebar: command list */}
        <aside className="sticky top-[calc(2.5rem+1.75rem+2.25rem)] hidden h-[calc(100vh-6.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border bg-black scrollbar-thin lg:block">
          <div className="border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            Main Menu
          </div>
          <nav>
            {primaryNav.map((item) => {
              const Icon = icons[item.label as keyof typeof icons] ?? ChevronRight;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 border-b border-border/60 px-3 py-2 text-xs text-slate-300 transition hover:bg-primary/[0.08] hover:text-primary"
                >
                  <span className="w-11 shrink-0 font-bold uppercase tracking-wider text-primary">
                    {codes[item.label] ?? "--"}
                  </span>
                  <Icon className="h-3.5 w-3.5 text-muted group-hover:text-primary" aria-hidden="true" />
                  <span className="uppercase tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main workspace */}
        <div className="min-w-0 flex-1">
          <main className="px-3 py-4 sm:px-4">{children}</main>
          <footer className="flex items-center justify-between gap-3 border-t border-border bg-black px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted">
            <div className="flex items-center gap-3">
              <span className="term-blink text-success">● live</span>
              <span>Eagle Quantitative</span>
              <span className="hidden sm:inline">Data delayed 15m</span>
            </div>
            <span className="text-primary">Powered by Eagle Terminal</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
