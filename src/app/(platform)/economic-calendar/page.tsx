import type { Metadata } from "next";

import { SectionHeading } from "@/components/market/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEconomicCalendar } from "@/lib/api-clients";

export const metadata: Metadata = {
  title: "Economic Calendar",
  description: "Macro calendar with high-impact economic releases, forecasts, previous values, and actual prints."
};

export default async function EconomicCalendarPage() {
  const events = await getEconomicCalendar();

  return (
    <div>
      <SectionHeading
        eyebrow="Macro calendar"
        title="Economic Calendar"
        description="Track upcoming macro events, consensus forecasts, prior readings, actual prints, and market importance."
      />
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Importance</TableHead>
                <TableHead className="text-right">Previous</TableHead>
                <TableHead className="text-right">Forecast</TableHead>
                <TableHead className="text-right">Actual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={`${event.date}-${event.event}`}>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.country}</TableCell>
                  <TableCell className="font-semibold text-white">{event.event}</TableCell>
                  <TableCell>
                    <Badge variant={event.importance === "High" ? "danger" : event.importance === "Medium" ? "default" : "muted"}>
                      {event.importance}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{event.previous}</TableCell>
                  <TableCell className="text-right">{event.forecast}</TableCell>
                  <TableCell className="text-right">{event.actual ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
