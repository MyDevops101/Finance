import Link from "next/link";
import {
  BarChart3,
  Bot,
  CalendarDays,
  ChevronRight,
  Gauge,
  Landmark,
  LineChart,
  Newspaper,
  PieChart,
  Search,
  ShieldCheck,
  UserRoundSearch,
  WalletCards
} from "lucide-react";

import { MarketTicker } from "@/components/market/market-ticker";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/components/layout/nav-data";

const icons = {
  Dashboard: Gauge,
  Market: LineChart,
  Screener: Search,
  Insiders: UserRoundSearch,
  Congress: Landmark,
  ETFs: PieChart,
  Crypto: BarChart3,
  Calendar: CalendarDays,
  News: Newspaper,
  Portfolio: WalletCards,
  Research: ShieldCheck,
  "AI Insights": Bot
};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-[#080C14]/95 p-4 lg:block">
        <Link href="/" className="mb-6 flex items-center gap-3 rounded-lg px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/[0.12] text-primary">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-bold">Quiver</div>
            <div className="text-xs text-muted">Quantitative</div>
          </div>
        </Link>
        <nav className="space-y-1">
          {primaryNav.map((item) => {
            const Icon = icons[item.label as keyof typeof icons] ?? ChevronRight;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-[#0B0F19]/92 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-bold">Quiver</span>
            </Link>
            <div className="hidden flex-1 md:block">
              <MarketTicker compact />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/pricing">Upgrade</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/api/auth/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
