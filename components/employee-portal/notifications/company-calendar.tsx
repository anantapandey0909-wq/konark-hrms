"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Flag } from "lucide-react";

interface HolidayItem {
  id: string;
  name: string;
  date: string;
}

interface EventItem {
  id: string;
  name: string;
  date: string;
}

interface CompanyCalendarProps {
  readonly holidays: readonly HolidayItem[];
  readonly events: readonly EventItem[];
}

export function CompanyCalendar({ holidays, events }: CompanyCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Consolidate dates for visual highlights on calendar
  const highlightedDates = React.useMemo(() => {
    const dates: Date[] = [];
    holidays.forEach((h) => dates.push(new Date(h.date)));
    events.forEach((e) => dates.push(new Date(e.date)));
    return dates;
  }, [holidays, events]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          Company Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border border-slate-100 dark:border-slate-800"
          modifiers={{ highlighted: highlightedDates }}
          modifiersStyles={{
            highlighted: { backgroundColor: "rgba(99, 102, 241, 0.15)", fontWeight: "bold" }
          }}
        />
      </CardContent>
    </Card>
  );
}