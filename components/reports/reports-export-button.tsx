"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReportsExportDialog } from "./reports-export-dialog";

export interface ReportsExportButtonProps {
  disabled?: boolean;
  className?: string;
}

export function ReportsExportButton({
  disabled = false,
  className,
}: ReportsExportButtonProps) {
  return (
    <ReportsExportDialog
      trigger={
        <Button
          variant="outline"
          disabled={disabled}
          className={cn("gap-2", className)}
        >
          <Download className="h-4 w-4 text-muted-foreground" />
          Export Reports
        </Button>
      }
    />
  );
}