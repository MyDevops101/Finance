import type { Metadata } from "next";
import { Database, LineChart, ShieldCheck } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Eagle Quantitative and its mission to democratize institutional market intelligence."
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Badge variant="accent">About</Badge>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold text-white">Institutional market intelligence, built from public data.</h1>
        <p className="mt-5 max-w-3xl leading-7 text-muted">
          Eagle Quantitative brings filings, macro data, sentiment, portfolio analytics, and quantitative research into a single product surface for investors, traders, analysts, and researchers.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <Database className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-white">Public data first</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Built around free APIs, SEC data, government releases, macro series, and public disclosures.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <LineChart className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-white">Quant-native</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Every module is designed to turn observations into measurable, testable investment signals.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-white">Production-minded</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Authentication, database models, security headers, caching, and Vercel deployment paths are included.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

