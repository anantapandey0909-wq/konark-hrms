"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, AlertCircle } from "lucide-react";

interface CompletionData {
  percentage: number;
  pendingItems: readonly string[];
}

interface ProfileCompletionProps {
  readonly data: CompletionData;
}

export function ProfileCompletion({ data }: ProfileCompletionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Award className="h-4 w-4 text-slate-400" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Completeness Score</span>
            <span className="font-bold text-slate-900 dark:text-slate-50">{data.percentage}%</span>
          </div>
          <Progress value={data.percentage} className="h-2" />
        </div>

        {data.pendingItems.length > 0 && (
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Pending Compliance Items
            </div>
            <ul className="space-y-2">
              {data.pendingItems.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-500 dark:text-slate-400 pl-3 border-l-2 border-amber-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}