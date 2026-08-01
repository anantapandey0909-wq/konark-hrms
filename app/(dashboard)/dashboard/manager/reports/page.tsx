"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ReportsConsolePage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerExport = (reportType: string) => {
    setExporting(reportType);
    setSuccessMsg(null);
    setTimeout(() => {
      setExporting(null);
      setSuccessMsg(`Compiled: ${reportType} was compiled to PDF successfully.`);
    }, 1200);
  };

  const reports = [
    { name: "Team Attendance Analysis", desc: "Detailed summary of punctuality rates, hours logged, and absents.", type: "Attendance" },
    { name: "KPI & Performance Record", desc: "Comprehensive metrics tracking quarterly tasks and goal achievements.", type: "Performance" },
    { name: "Authorization & Leave Logs", desc: "Consolidated index of approved and pending team leave requests.", type: "Leave" }
  ];

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-2">
      <Button asChild>
  <Link href="...">
    ...
  </Link>
</Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-7 w-7 text-indigo-500" />
            <span>Operational Reporting Console</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Export structured database records regarding department performance parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {reports.map((r) => (
            <Card key={r.name} className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{r.desc}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => triggerExport(r.type)} 
                  disabled={exporting !== null}
                  className="font-bold text-[11px] h-9 gap-1 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  {exporting === r.type ? "Compiling..." : "Export PDF"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Period Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Reporting Department</label>
                <Input defaultValue="Platform Engineering" disabled className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Target Range Start</label>
                <Input type="date" defaultValue="2025-05-01" className="h-9 text-xs" />
              </div>
              
              {successMsg && (
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    {successMsg}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}