import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getFactorModel, type FactorKey } from "@/lib/providers/factors";
import { cn } from "@/lib/utils";

function zClass(z: number) {
  if (z > 0.5) return "text-success";
  if (z < -0.5) return "text-danger";
  return "text-muted";
}

export async function FactorModels() {
  const model = await getFactorModel();
  const ranked = [...model.scores].sort((a, b) => b.composite - a.composite);
  const cols: { key: FactorKey; label: string }[] = [
    { key: "value", label: "Value" },
    { key: "momentum", label: "Mom" },
    { key: "quality", label: "Qual" },
    { key: "size", label: "Size" },
    { key: "lowVol", label: "LowVol" }
  ];

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {model.factors.map((f) => (
          <Card key={f.key}>
            <CardContent className="p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{f.name}</p>
              <p className="mt-1 text-[10px] leading-4 text-muted">{f.description}</p>
              <div className="mt-2 border-t border-border pt-2 text-[10px] uppercase tracking-wider">
                <div className="flex justify-between">
                  <span className="text-muted">Long</span>
                  <span className="font-bold text-success">{f.longs.join(" ")}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted">Short</span>
                  <span className="font-bold text-danger">{f.shorts.join(" ")}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted">L/S spread</span>
                  <span className="font-bold tabular-nums text-primary">{f.spread.toFixed(2)}σ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Factor Exposures · z-scores by name</CardTitle>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              {model.source === "live" ? "Live universe · FMP" : "Universe"}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="scrollbar-thin overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Sector</TableHead>
                    {cols.map((c) => (
                      <TableHead key={c.key} className="text-right">
                        {c.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Composite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranked.map((s) => (
                    <TableRow key={s.symbol}>
                      <TableCell className="font-bold text-primary">{s.symbol}</TableCell>
                      <TableCell className="text-muted">{s.sector}</TableCell>
                      {cols.map((c) => (
                        <TableCell key={c.key} className={cn("text-right tabular-nums", zClass(s[c.key]))}>
                          {s[c.key] >= 0 ? "+" : ""}
                          {s[c.key].toFixed(2)}
                        </TableCell>
                      ))}
                      <TableCell className={cn("text-right font-bold tabular-nums", zClass(s.composite))}>
                        {s.composite >= 0 ? "+" : ""}
                        {s.composite.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
