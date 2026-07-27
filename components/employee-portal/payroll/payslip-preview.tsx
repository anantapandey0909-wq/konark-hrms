"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Mail, Printer, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PayslipPreviewProps {
  readonly month: string;
  readonly year: number;
}

export function PayslipPreview({ month, year }: PayslipPreviewProps) {
  const handleDownload = () => {
    toast.success("Payslip download initiated", {
      description: `Downloading structural payslip document for ${month} ${year}.`,
    });
  };

  const handlePrint = () => {
    toast.info("Preparing print spooler", {
      description: `Preparing localized print interface for structural payslip document.`,
    });
  };

  const handleEmail = () => {
    toast.success("Payslip sent successfully", {
      description: `Your verified structural payslip for ${month} ${year} has been queued to your registered official email.`,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-slate-400" />
          Active Payslip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Statement</div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
            Statement Period &bull; {month} {year}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1.5 h-auto py-2.5 text-xs"
            aria-label="Download payroll document PDF"
          >
            <Download className="h-4 w-4 text-slate-500" />
            PDF
          </Button>

          <Button
            onClick={handleEmail}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1.5 h-auto py-2.5 text-xs"
            aria-label="Email payroll details copy"
          >
            <Mail className="h-4 w-4 text-slate-500" />
            Email
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1.5 h-auto py-2.5 text-xs"
            aria-label="Spool printer spooler"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}