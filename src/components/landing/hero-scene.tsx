"use client";

import { motion } from "framer-motion";

import { marketIndices, sectorReturns } from "@/lib/mock-data";
import { cn, formatPercent } from "@/lib/utils";

export function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden market-grid">
      <div className="absolute inset-0 bg-[#0B0F19]/75" />
      <div className="absolute inset-x-4 top-24 mx-auto grid max-w-6xl gap-3 opacity-70 md:grid-cols-[1.3fr_0.7fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-panel rounded-lg p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">LIVE MARKET INTELLIGENCE</span>
            <span className="text-xs text-muted">Latency 142ms</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {marketIndices.slice(0, 6).map((item) => (
              <div key={item.symbol} className="rounded-lg border border-border bg-black/[0.18] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{item.symbol}</span>
                  <span className={cn(item.changePct >= 0 ? "text-success" : "text-danger")}>
                    {formatPercent(item.changePct)}
                  </span>
                </div>
                <div className="mt-3 flex h-12 items-end gap-1">
                  {item.sparkline.map((value, index) => {
                    const min = Math.min(...item.sparkline);
                    const max = Math.max(...item.sparkline);
                    const height = ((value - min) / Math.max(1, max - min)) * 38 + 10;
                    return (
                      <motion.span
                        key={`${item.symbol}-${index}`}
                        initial={{ height: 6 }}
                        animate={{ height }}
                        transition={{ duration: 0.6, delay: index * 0.04 }}
                        className={cn("w-full rounded-sm", item.changePct >= 0 ? "bg-success" : "bg-danger")}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-panel rounded-lg p-4"
        >
          <div className="mb-3 text-xs font-semibold text-primary">SECTOR FLOW</div>
          <div className="space-y-2">
            {sectorReturns.slice(0, 6).map((sector) => (
              <div key={sector.sector} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
                <span className="text-xs text-slate-200">{sector.sector}</span>
                <span className={cn("text-xs font-bold", sector.oneDay >= 0 ? "text-success" : "text-danger")}>
                  {formatPercent(sector.oneDay)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
