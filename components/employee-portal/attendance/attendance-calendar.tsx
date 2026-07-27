"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface CalendarDay {
  date: string;
  status: "PRESENT" | "ABSENT" | "LEAVE" | "HOLIDAY" | "WEEKEND";
  punchIn?: string;
  punchOut?: string;
}

interface AttendanceCalendarProps {
  readonly days: readonly CalendarDay[];
}

export function AttendanceCalendar({ days }: AttendanceCalendarProps) {
  const getStatusStyles = (status: CalendarDay["status"]) => {
    switch (status) {
      case "PRESENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/30";
      case "LEAVE":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/30";
      case "HOLIDAY":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/10 dark:text-sky-400 dark:border-sky-900/30";
      case "WEEKEND":
        return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/10 dark:text-rose-400 dark:border-rose-900/30";
    }
  };

  const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          Attendance Ledger (October 2025)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="pb-3 font-medium">Day & Date</th>
                <th className="pb-3 font-medium">First Punch</th>
                <th className="pb-3 font-medium">Last Punch</th>
                <th className="pb-3 font-medium">Daily Status</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.date} className="border-b border-slate-50 hover:bg-slate-50/40 dark:border-slate-850 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {getFormattedDate(day.date)}
                    </div>
                    <div className="text-xs text-slate-400">{getDayOfWeek(day.date)}</div>
                  </td>
                  <td className="py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300">
                    {day.punchIn || "—"}
                  </td>
                  <td className="py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300">
                    {day.punchOut || "—"}
                  </td>
                  <td className="py-3.5">
                    <Badge variant="outline" className={`${getStatusStyles(day.status)} text-[10px] tracking-wide uppercase font-semibold`}>
                      {day.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}