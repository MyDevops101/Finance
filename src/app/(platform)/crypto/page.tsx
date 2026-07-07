import type { Metadata } from "next";

import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { SectionHeading } from "@/components/market/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCryptoMarkets } from "@/lib/api-clients";
import { formatCompact, formatCurrency, formatPercent, getChangeClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Crypto dashboard with price, market cap, volume, dominance, and momentum."
};

export default async function CryptoPage() {
  const assets = await getCryptoMarkets();

  return (
    <div>
      <SectionHeading
        eyebrow="Digital assets"
        title="Crypto Dashboard"
        description="Track price, momentum, market cap, volume, dominance, and cross-asset risk appetite."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.symbol}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{asset.name}</CardTitle>
                <span className={`text-sm font-semibold ${getChangeClass(asset.changePct)}`}>{formatPercent(asset.changePct)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(asset.price, asset.price > 1000 ? 0 : 2)}</div>
              <div className="mt-5 h-24">
                <MiniSparkline data={asset.sparkline} positive={asset.changePct >= 0} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                <Field label="Cap" value={formatCompact(asset.marketCap)} />
                <Field label="Volume" value={formatCompact(asset.volume)} />
                <Field label="Dominance" value={`${asset.dominance.toFixed(1)}%`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/5 p-3">
      <div className="text-muted">{label}</div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}
