"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileEdit, ClipboardCheck, ArrowUpRight } from "lucide-react";

export function AttendanceActions() {
  const handleRegularizeRequest = () => {
    toast.info("Coming Soon", {
      description: "Attendance regularization request workflows will be available in next phase updates.",
    });
  };

  const handleLeaveConversion = () => {
    toast.info("Coming Soon", {
      description: "Auto leave-conversion configurations are being completed.",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-slate-400" />
          Request Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 pt-5">
        <Button
          onClick={handleRegularizeRequest}
          variant="outline"
          className="w-full flex items-center justify-between"
          aria-label="Request attendance regularization"
        >
          <span className="flex items-center gap-2">
            <FileEdit className="h-4 w-4 text-slate-500" />
            Regularize Attendance
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Button>

        <Button
          onClick={handleLeaveConversion}
          variant="outline"
          className="w-full flex items-center justify-between"
          aria-label="Access leave balance conversions"
        >
          <span className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-slate-500" />
            Leave Conversion
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Button>
      </CardContent>
    </Card>
  );
}