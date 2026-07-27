"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileEdit, ClipboardCheck, ArrowUpRight } from "lucide-react";

export function PayrollActions() {
  const handleTaxDeclaration = () => {
    toast.info("Coming Soon", {
      description: "Direct tax planning declarations and standard IT declaration forms are coming soon.",
    });
  };

  const handleReimbursementClaim = () => {
    toast.info("Coming Soon", {
      description: "Direct reimbursement submissions and localized business expense logs are coming soon.",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-slate-400" />
          Financial Services
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 pt-5">
        <Button
          onClick={handleTaxDeclaration}
          variant="outline"
          className="w-full flex items-center justify-between"
          aria-label="Access tax configuration declaration portal"
        >
          <span className="flex items-center gap-2">
            <FileEdit className="h-4 w-4 text-slate-500" />
            IT Declaration Form
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Button>

        <Button
          onClick={handleReimbursementClaim}
          variant="outline"
          className="w-full flex items-center justify-between"
          aria-label="Initiate new reimbursement claims log"
        >
          <span className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-slate-500" />
            File Reimbursement Claim
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Button>
      </CardContent>
    </Card>
  );
}