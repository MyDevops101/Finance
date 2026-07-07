import { getFxRates } from "@/lib/providers/fx";

export async function FxBoard() {
  const rates = await getFxRates();
  return (
    <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
      {rates.map((r) => (
        <div key={r.pair} className="bg-[#05070a] p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{r.pair}</div>
          <div className="mt-1 text-lg font-bold tabular-nums text-foreground">
            {r.rate < 10 ? r.rate.toFixed(4) : r.rate.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
