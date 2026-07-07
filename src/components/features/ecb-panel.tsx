import { Card, CardContent } from "@/components/ui/card";
import { getEcbIndicators } from "@/lib/providers/ecb";

export async function EcbPanel() {
  const indicators = await getEcbIndicators();
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {indicators.map((ind) => (
        <Card key={ind.id}>
          <CardContent className="p-3">
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-primary">{ind.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {ind.value.toFixed(ind.unit === "%" ? 2 : 4)}
              {ind.unit ? <span className="ml-1 text-xs text-muted">{ind.unit}</span> : null}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
              {ind.date ? `As of ${ind.date}` : "ECB Data Portal"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
