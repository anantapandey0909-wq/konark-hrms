"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  name: string;
  time: string;
  date: string;
  location: string;
}

interface CompanyEventsProps {
  readonly events: readonly Event[];
}

export function CompanyEvents({ events }: CompanyEventsProps) {
  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-slate-400" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 border-b border-slate-50 pb-3.5 last:border-0 last:pb-0 dark:border-slate-850"
          >
            <div className="rounded bg-indigo-50 px-2.5 py-1.5 text-center dark:bg-indigo-950/20 shrink-0">
              <span className="block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                {getFormattedDate(event.date).split(" ")[0]}
              </span>
              <span className="block text-sm font-extrabold text-indigo-700 dark:text-indigo-300">
                {getFormattedDate(event.date).split(" ")[1]}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {event.name}
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}