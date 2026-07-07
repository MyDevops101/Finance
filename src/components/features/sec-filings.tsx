import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SecFiling } from "@/lib/providers/sec";

function formBadge(form: string): "danger" | "default" | "accent" | "muted" {
  if (form.startsWith("4") || form === "3" || form === "5") return "danger";
  if (form.startsWith("10")) return "default";
  if (form.startsWith("8")) return "accent";
  return "muted";
}

export function SecFilings({ filings, showSymbol = true }: { filings: SecFiling[]; showSymbol?: boolean }) {
  if (!filings.length) {
    return <div className="px-3 py-6 text-center text-xs text-muted">No filings returned.</div>;
  }
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {showSymbol ? <TableHead>Symbol</TableHead> : null}
            <TableHead>Company</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Filed</TableHead>
            <TableHead className="text-right">Doc</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filings.map((f) => (
            <TableRow key={`${f.symbol}-${f.accession}`}>
              {showSymbol ? <TableCell className="font-bold text-primary">{f.symbol}</TableCell> : null}
              <TableCell className="text-foreground">{f.company}</TableCell>
              <TableCell>
                <Badge variant={formBadge(f.form)}>{f.form}</Badge>
              </TableCell>
              <TableCell className="text-muted">{f.description}</TableCell>
              <TableCell className="tabular-nums">{f.filedAt}</TableCell>
              <TableCell className="text-right">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-primary"
                >
                  open ↗
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
