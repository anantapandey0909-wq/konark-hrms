"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Eye } from "lucide-react";
import { formatINR } from "@/lib/payroll/formatters";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HistoryLog {
  id: string;
  period: string;
  gross: number;
  deductions: number;
  net: number;
  status: "PAID" | "PROCESSED" | "ON_HOLD";
  paidAt: string;
}

interface PayrollHistoryProps {
  readonly history: readonly HistoryLog[];
}

export function PayrollHistory({ history }: PayrollHistoryProps) {
  const safeFormat = (val: number) => {
    try {
      return formatINR(val);
    } catch {
      return `₹${val.toLocaleString("en-IN")}`;
    }
  };

  const handleInspectPayslip = (period: string) => {
    toast.info("Payslip Query", {
      description: `Loading historical structural payslip configuration for ${period}.`,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          Disbursement History
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="pb-3 font-medium">Pay Period</th>
                <th className="pb-3 font-medium text-right">Gross Salary</th>
                <th className="pb-3 font-medium text-right">Deductions</th>
                <th className="pb-3 font-medium text-right">Net Paid</th>
                <th className="pb-3 font-medium text-center">Disbursed Date</th>
                <th className="pb-3 font-medium text-right">Status</th>
                <th className="pb-3 font-medium w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {history.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/40 dark:border-slate-850 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                    {log.period}
                  </td>
                  <td className="py-3.5 text-right font-medium text-slate-600 dark:text-slate-300">
                    {safeFormat(log.gross)}
                  </td>
                  <td className="py-3.5 text-right font-medium text-slate-600 dark:text-slate-300">
                    {safeFormat(log.deductions)}
                  </td>
                  <td className="py-3.5 text-right font-bold text-slate-950 dark:text-slate-50">
                    {safeFormat(log.net)}
                  </td>
                  <td className="py-3.5 text-center text-xs text-slate-500 dark:text-slate-400">
                    {new Date(log.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="py-3.5 text-right">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/30 text-[9px] tracking-wider uppercase font-semibold">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleInspectPayslip(log.period)}
                      title="Inspect Payslip"
                      aria-label={`View payslip for ${log.period}`}
                    >
                      <Eye className="h-4 w-4 text-slate-400" />
                    </Button>
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