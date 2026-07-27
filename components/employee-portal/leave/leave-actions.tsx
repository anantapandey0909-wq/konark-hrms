"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Landmark, ArrowUpRight } from "lucide-react";

export function LeaveActions() {
  const handleDownloadPolicy = () => {
    toast.info("Coming Soon", {
      description: "Company leave compliance handbook and local policy document downloads are being updated.",
    });
  };

  const handleCompOffRequest = () => {
    toast.info("Coming Soon", {
      description: "Compensatory Off generation and credit request form workflows are coming soon.",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/40">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Landmark className="h-4 w-4 text-slate-400" />
          Leave Configurations
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 pt-5">
        <Button
          onClick={handleDownloadPolicy}
          variant="outline"
          className="w-full flex items-center justify-between"
          aria-label="Download corporate leave policy document"
        >
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4 text-slate-500" />
            Leave Policy Document
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Button>

        <Button
          onClick={handleCompOffRequest}
          variant="outline"
          className="w-full flex items-center justify-between"
          aria-label="Access compensatory off generation form"
        >
          <span className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-slate-500" />
            Comp-Off Generation Request
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Button>
      </CardContent>
    </Card>
  );
}