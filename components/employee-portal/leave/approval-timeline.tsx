"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, CircleCheck, Circle, Clock } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  status: "COMPLETED" | "PENDING" | "UPCOMING";
  date?: string;
}

interface TimelineStructure {
  requestType: string;
  dateRange: string;
  steps: readonly Step[];
}

interface ApprovalTimelineProps {
  readonly timeline: TimelineStructure;
}

export function ApprovalTimeline({ timeline }: ApprovalTimelineProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          Active Approval Chain
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="mb-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{timeline.requestType}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{timeline.dateRange}</div>
        </div>

        <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800 space-y-6">
          {timeline.steps.map((step) => {
            const isCompleted = step.status === "COMPLETED";
            const isPending = step.status === "PENDING";

            return (
              <div key={step.id} className="relative">
                {/* Visual Status Indicator Node */}
                <span className="absolute -left-[30px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white dark:bg-slate-950 ring-4 ring-white dark:ring-slate-950">
                  {isCompleted ? (
                    <CircleCheck className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                  ) : isPending ? (
                    <Clock className="h-4.5 w-4.5 text-amber-500 fill-amber-50 dark:fill-amber-950" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300" />
                  )}
                </span>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h4>
                    {step.date && <span className="text-[10px] text-slate-400">{new Date(step.date).toLocaleDateString()}</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}