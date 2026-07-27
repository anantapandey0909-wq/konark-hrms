"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, Calendar } from "lucide-react";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "MANDATORY" | "OPTIONAL";
}

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
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Flag className="h-4 w-4 text-slate-400" />
          Next Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {holidays.map((holiday) => (
          <div
            key={holiday.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-850"
          >
            <div className="flex items-center gap-3">
              <div className="rounded bg-sky-50 p-2 dark:bg-sky-950/20">
                <Calendar className="h-4 w-4 text-sky-500" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {holiday.name}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {getFormattedDate(holiday.date)}
                </p>
              </div>
            </div>
            <div>
              <Badge variant="outline" className="text-[9px] uppercase tracking-wide">
                {holiday.type}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}