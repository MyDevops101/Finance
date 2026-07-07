import Link from "next/link";
import type { Metadata } from "next";
import { Check, Rocket } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing for Quiver Quantitative investment intelligence."
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    features: ["Market dashboard", "Screener demo", "News sentiment", "Research lab sandbox"]
  },
  {
    name: "Analyst",
    price: "$29",
    features: ["Saved screens", "Portfolio analytics", "Congress and insider alerts", "CSV exports"]
  },
  {
    name: "Institution",
    price: "Custom",
    features: ["Team workspaces", "API access", "Custom provider keys", "Compliance review support"]
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Badge variant="accent">Pricing</Badge>
        <h1 className="mt-5 text-4xl font-bold text-white">Start free. Scale when the workflow is earning its keep.</h1>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.name === "Analyst" ? "border-primary/45" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.name === "Analyst" ? <Rocket className="h-5 w-5 text-primary" aria-hidden="true" /> : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{tier.price}</div>
                <div className="mt-1 text-sm text-muted">{tier.price === "Custom" ? "Annual contract" : "per user/month"}</div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-success" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={tier.name === "Free" ? "secondary" : "default"} asChild>
                  <Link href={tier.name === "Institution" ? "/contact" : "/dashboard"}>{tier.name === "Institution" ? "Contact Sales" : "Start Free"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
