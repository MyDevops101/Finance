import Link from "next/link";
import { BarChart3, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="relative z-20 border-b border-border bg-[#0B0F19]/[0.86] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Quiver</div>
            <div className="text-xs text-muted">Quantitative</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/screener" className="hover:text-white">Screener</Link>
          <Link href="/research-lab" className="hover:text-white">Research</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign in
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard">Start Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
