"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Umbrella } from "lucide-react";

interface UpcomingItem {
  id: string;
  type: string;
  dateRange: string;
  days: number;
  status: "APPROVED" | "PENDING";
}

interface UpcomingLeaveProps {
  readonly leaves: readonly UpcomingItem[];
}

export function UpcomingLeave({ leaves }: UpcomingLeaveProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Umbrella className="h-4 w-4 text-slate-400" />
          Confirmed Off (Upcoming)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {leaves.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No upcoming leaves scheduled.</p>
        ) : (
          leaves.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-950/40">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-50">
                    {item.type}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.dateRange}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-[9px] uppercase tracking-wide">
                  {item.days} {item.days > 1 ? "Days" : "Day"} Approved
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}