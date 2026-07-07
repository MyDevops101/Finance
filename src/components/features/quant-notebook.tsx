"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Equity } from "@/lib/types";
import { cn } from "@/lib/utils";

type CellType = "momentum" | "value" | "quality" | "lowvol" | "summary" | "note";

type Cell = { id: number; type: CellType; metric: MetricKey; note: string };

type MetricKey = "changePct" | "peRatio" | "marketCap" | "beta" | "revenueGrowth" | "dividendYield";

const METRICS: { key: MetricKey; label: string }[] = [
  { key: "changePct", label: "Day change %" },
  { key: "peRatio", label: "P/E ratio" },
  { key: "marketCap", label: "Market cap" },
  { key: "beta", label: "Beta" },
  { key: "revenueGrowth", label: "Revenue growth" },
  { key: "dividendYield", label: "Dividend yield" }
];

const CELL_LABELS: Record<CellType, string> = {
  momentum: "Momentum scan (top day change)",
  value: "Value scan (lowest P/E)",
  quality: "Quality scan (highest rev growth)",
  lowvol: "Low-vol scan (lowest beta)",
  summary: "Summary statistics",
  note: "Markdown note"
};

let counter = 3;

export function QuantNotebook() {
  const [universe, setUniverse] = useState<Equity[]>([]);
  const [loading, setLoading] = useState(true);
  const [cells, setCells] = useState<Cell[]>([
    { id: 1, type: "momentum", metric: "changePct", note: "" },
    { id: 2, type: "summary", metric: "peRatio", note: "" }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/screener");
        const data = (await res.json()) as { stocks: Equity[] };
        setUniverse(data.stocks ?? []);
      } catch {
        setUniverse([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addCell = (type: CellType) =>
    setCells((c) => [...c, { id: counter++, type, metric: "changePct", note: "" }]);
  const removeCell = (id: number) => setCells((c) => c.filter((x) => x.id !== id));
  const update = (id: number, patch: Partial<Cell>) =>
    setCells((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <span className="text-[10px] uppercase tracking-wider text-muted">Add cell:</span>
        {(Object.keys(CELL_LABELS) as CellType[]).map((t) => (
          <button key={t} onClick={() => addCell(t)} className="fn-key">
            + {t}
          </button>
        ))}
        <Badge variant={loading ? "muted" : "success"} className="ml-auto">
          {loading ? "Loading universe…" : `Universe: ${universe.length} names`}
        </Badge>
      </div>

      <div className="space-y-4">
        {cells.map((cell, i) => (
          <NotebookCell
            key={cell.id}
            index={i + 1}
            cell={cell}
            universe={universe}
            onRemove={() => removeCell(cell.id)}
            onChange={(patch) => update(cell.id, patch)}
          />
        ))}
      </div>
    </div>
  );
}

function NotebookCell({
  index,
  cell,
  universe,
  onRemove,
  onChange
}: {
  index: number;
  cell: Cell;
  universe: Equity[];
  onRemove: () => void;
  onChange: (patch: Partial<Cell>) => void;
}) {
  return (
    <div className="border border-border">
      <div className="flex items-center gap-2 border-b border-border bg-white/[0.02] px-3 py-1.5">
        <span className="font-bold text-primary">[{index}]</span>
        <span className="text-[10px] uppercase tracking-wider text-muted">{CELL_LABELS[cell.type]}</span>
        {cell.type === "summary" ? (
          <select
            value={cell.metric}
            onChange={(e) => onChange({ metric: e.target.value as MetricKey })}
            className="ml-2 h-6 border border-border bg-[#0a0c0f] px-1 text-[11px] text-foreground outline-none"
            aria-label="Metric"
          >
            {METRICS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        ) : null}
        <button onClick={onRemove} aria-label="Remove cell" className="ml-auto text-muted hover:text-danger">
          ✕
        </button>
      </div>
      <div className="p-3">
        {cell.type === "note" ? (
          <textarea
            value={cell.note}
            onChange={(e) => onChange({ note: e.target.value })}
            placeholder="# Research note — type observations here…"
            className="h-20 w-full resize-y border border-border bg-[#0a0c0f] p-2 text-xs text-foreground outline-none focus:border-primary"
          />
        ) : (
          <CellOutput cell={cell} universe={universe} />
        )}
      </div>
    </div>
  );
}

function num(e: Equity, k: MetricKey): number {
  return (e[k] as number) ?? 0;
}

function CellOutput({ cell, universe }: { cell: Cell; universe: Equity[] }) {
  const result = useMemo(() => {
    if (!universe.length) return null;
    if (cell.type === "summary") {
      const vals = universe.map((e) => num(e, cell.metric)).sort((a, b) => a - b);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const median = vals[Math.floor(vals.length / 2)];
      return {
        kind: "stats" as const,
        rows: [
          ["Count", vals.length.toString()],
          ["Mean", mean.toFixed(2)],
          ["Median", median.toFixed(2)],
          ["Min", vals[0].toFixed(2)],
          ["Max", vals[vals.length - 1].toFixed(2)]
        ]
      };
    }
    const sorters: Record<string, (a: Equity, b: Equity) => number> = {
      momentum: (a, b) => b.changePct - a.changePct,
      value: (a, b) => a.peRatio - b.peRatio,
      quality: (a, b) => b.revenueGrowth - a.revenueGrowth,
      lowvol: (a, b) => a.beta - b.beta
    };
    const sorted = [...universe].sort(sorters[cell.type]).slice(0, 8);
    return { kind: "table" as const, rows: sorted };
  }, [cell.type, cell.metric, universe]);

  if (!result) return <div className="text-xs text-muted">No data.</div>;

  if (result.kind === "stats") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {result.rows.map(([label, value]) => (
          <div key={label} className="border border-border bg-[#05070a] p-2">
            <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
            <div className="text-sm font-bold tabular-nums text-foreground">{value}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Chg%</TableHead>
          <TableHead className="text-right">P/E</TableHead>
          <TableHead className="text-right">Rev g%</TableHead>
          <TableHead className="text-right">Beta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.rows.map((e) => (
          <TableRow key={e.symbol}>
            <TableCell className="font-bold text-primary">{e.symbol}</TableCell>
            <TableCell className="truncate text-muted">{e.name}</TableCell>
            <TableCell className={cn("text-right tabular-nums", e.changePct >= 0 ? "text-success" : "text-danger")}>
              {e.changePct.toFixed(2)}
            </TableCell>
            <TableCell className="text-right tabular-nums">{e.peRatio.toFixed(1)}</TableCell>
            <TableCell className="text-right tabular-nums">{e.revenueGrowth.toFixed(1)}</TableCell>
            <TableCell className="text-right tabular-nums">{e.beta.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
