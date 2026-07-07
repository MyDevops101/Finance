"use client";

import { useEffect, useState } from "react";

const zones = [
  { label: "NY", tz: "America/New_York" },
  { label: "LDN", tz: "Europe/London" },
  { label: "TKY", tz: "Asia/Tokyo" }
];

function timeIn(tz: string, date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz
  }).format(date);
}

export function TerminalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden items-center gap-3 text-[11px] tabular-nums md:flex" suppressHydrationWarning>
      {zones.map((zone) => (
        <div key={zone.label} className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{zone.label}</span>
          <span className="text-foreground">{now ? timeIn(zone.tz, now) : "--:--:--"}</span>
        </div>
      ))}
    </div>
  );
}
