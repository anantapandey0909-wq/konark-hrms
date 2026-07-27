"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Holiday } from "@/types/employee-portal";
import { Calendar } from "lucide-react";

interface UpcomingHolidaysProps {
  readonly holidays: readonly Holiday[];
}

export function UpcomingHolidays({ holidays }: UpcomingHolidaysProps) {
  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {holidays.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No upcoming holidays scheduled.</p>
        ) : (
          holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-950/40">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {holiday.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {getFormattedDate(holiday.date)}
                  </div>
                </div>
              </div>
              <div>
                {holiday.isOptional ? (
                  <Badge variant="outline" className="text-[10px] text-slate-500 uppercase tracking-wide">
                    Optional
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                    Mandatory
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}