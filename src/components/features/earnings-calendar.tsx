import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEarningsCalendar } from "@/lib/providers/earnings";

function hourLabel(hour: string) {
  if (hour === "bmo") return "Before open";
  if (hour === "amc") return "After close";
  return hour || "--";
}

export async function EarningsCalendar() {
  const events = await getEarningsCalendar();
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Timing</TableHead>
            <TableHead className="text-right">EPS est.</TableHead>
            <TableHead className="text-right">EPS actual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((e, i) => (
            <TableRow key={`${e.symbol}-${e.date}-${i}`}>
              <TableCell className="tabular-nums">{e.date}</TableCell>
              <TableCell className="font-bold text-primary">{e.symbol}</TableCell>
              <TableCell>
                <Badge variant="muted">{hourLabel(e.hour)}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {e.epsEstimate != null ? e.epsEstimate.toFixed(2) : "--"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-foreground">
                {e.epsActual != null ? e.epsActual.toFixed(2) : "--"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
