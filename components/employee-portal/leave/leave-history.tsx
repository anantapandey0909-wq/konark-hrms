"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, FileText } from "lucide-react";

interface HistoryLog {
  id: string;
  type: string;
  dateRange: string;
  days: number;
  status: "APPROVED" | "PENDING" | "REJECTED";
  reason: string;
  appliedAt: string;
}

interface LeaveHistoryProps {
  readonly history: readonly HistoryLog[];
}

export function LeaveHistory({ history }: LeaveHistoryProps) {
  const getStatusStyles = (status: HistoryLog["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/30";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/30";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/10 dark:text-rose-400 dark:border-rose-900/30";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          Request History
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="pb-3 font-medium">Leave Structure</th>
                <th className="pb-3 font-medium">Applied Duration</th>
                <th className="pb-3 font-medium text-center">Days</th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/40 dark:border-slate-850 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{log.type}</div>
                    <div className="text-[10px] text-slate-400">Applied: {new Date(log.appliedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="py-3.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {log.dateRange}
                  </td>
                  <td className="py-3.5 text-center font-bold text-slate-900 dark:text-slate-100">
                    {log.days}
                  </td>
                  <td className="py-3.5 text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate" title={log.reason}>
                    {log.reason}
                  </td>
                  <td className="py-3.5 text-right">
                    <Badge variant="outline" className={`${getStatusStyles(log.status)} text-[9px] tracking-wider uppercase font-semibold`}>
                      {log.status}
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