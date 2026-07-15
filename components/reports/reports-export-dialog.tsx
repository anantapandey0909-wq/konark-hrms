"use client";
import { useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FileDown,
  FileText,
  FileSpreadsheet,
  FileCode,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ReportsExportDialogProps {
  trigger?: ReactNode;
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export function ReportsExportDialog({ trigger }: ReportsExportDialogProps) {
  type ExportFormat = "pdf" | "xlsx" | "csv";

const [format, setFormat] =
    useState<ExportFormat>("pdf");
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeStats, setIncludeStats] = useState<boolean>(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <motion.div layout
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Export Report</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select your preferred layout format and structural settings to export this report.
            </DialogDescription>
          </DialogHeader>

          {/* Export Format Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Export Format</Label>
          <RadioGroup
  value={format}
  onValueChange={(value) => setFormat(value as ExportFormat)}
  className="grid grid-cols-1 gap-3 sm:grid-cols-3"
>
              {/* PDF Format Option */}
              <div className="flex items-center space-x-2 rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <RadioGroupItem value="pdf" id="format-pdf" />
                <Label
                  htmlFor="format-pdf"
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground select-none"
                >
                  <FileText className="h-4 w-4 text-rose-500" />
                  PDF
                </Label>
              </div>

              {/* Excel Format Option */}
              <div className="flex items-center space-x-2 rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <RadioGroupItem value="xlsx" id="format-xlsx" />
                <Label
                  htmlFor="format-xlsx"
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground select-none"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                  Excel
                </Label>
              </div>

              {/* CSV Format Option */}
              <div className="flex items-center space-x-2 rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <RadioGroupItem value="csv" id="format-csv" />
                <Label
                  htmlFor="format-csv"
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground select-none"
                >
                  <FileCode className="h-4 w-4 text-blue-500" />
                  CSV
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Options Checkboxes */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <Label className="text-sm font-semibold text-foreground">Export Inclusions</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="include-charts"
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                />
                <Label
                  htmlFor="include-charts"
                  className="text-sm text-muted-foreground select-none cursor-pointer"
                >
                  Include Charts
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="include-stats"
                  checked={includeStats}
                  onCheckedChange={(checked) => setIncludeStats(!!checked)}
                />
                <Label
                  htmlFor="include-stats"
                  className="text-sm text-muted-foreground select-none cursor-pointer"
                >
                  Include Summary Statistics
                </Label>
              </div>
            </div>
          </div>

          {/* Disabled Processing Note */}
          <div className="flex items-start gap-2.5 rounded-md bg-muted/50 p-3 border border-border/40">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export compilation functions are currently undergoing scheduling. File download services will be activated in an upcoming sprint.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" disabled className="w-full sm:w-auto">
              Export Report
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}