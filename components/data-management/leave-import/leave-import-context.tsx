"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import {
  parseLeaveImportCsv,
  type ParsedLeaveImportRow,
} from "@/lib/data-management/parse-leave-import";
import { executeLeaveImport } from "@/lib/data/leave-import";
import type { LeaveImportResult } from "@/lib/validation/leave-import";

interface LeaveImportContextValue {
  rows: ParsedLeaveImportRow[];
  fileName: string | null;
  importResult: LeaveImportResult | null;
  isImporting: boolean;
  blankRowsSkipped: number;
  validCount: number;
  invalidCount: number;
  totalCount: number;
  canExecute: boolean;
  setFileFromText: (fileName: string, text: string) => void;
  clearFile: () => void;
  executeImport: () => Promise<void>;
}

const LeaveImportContext = createContext<LeaveImportContextValue | null>(null);

export function LeaveImportProvider({ children }: { children: React.ReactNode }) {
  const [rows, setRows] = useState<ParsedLeaveImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<LeaveImportResult | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);
  const [blankRowsSkipped, setBlankRowsSkipped] = useState(0);

  const validCount = rows.filter((r) => r.status === "valid").length;
  const invalidCount = rows.filter((r) => r.status === "invalid").length;
  const totalCount = rows.length;
  const canExecute = validCount > 0 && !isImporting;

  const setFileFromText = useCallback((name: string, text: string) => {
    const parsed = parseLeaveImportCsv(text);
    if (parsed.parseError) {
      toast.error(parsed.parseError);
      setRows([]);
      setFileName(null);
      setImportResult(null);
      setBlankRowsSkipped(0);
      return;
    }
    setRows(parsed.rows);
    setFileName(name);
    setImportResult(null);
    setBlankRowsSkipped(parsed.blankRowsSkipped);
    const blankNote =
      parsed.blankRowsSkipped > 0
        ? ` (${parsed.blankRowsSkipped} blank row(s) skipped)`
        : "";
    toast.success(`Loaded ${parsed.rows.length} row(s) from ${name}${blankNote}`);
  }, []);

  const clearFile = useCallback(() => {
    setRows([]);
    setFileName(null);
    setImportResult(null);
    setBlankRowsSkipped(0);
  }, []);

  const executeImport = useCallback(async () => {
    const validRows = rows
      .filter((r) => r.status === "valid" && r.data)
      .map((r) => r.data!);

    if (validRows.length === 0) {
      toast.error("No valid rows to import.");
      return;
    }

    setIsImporting(true);
    try {
      const result = await executeLeaveImport({ rows: validRows });
      setImportResult(result);

      if (result.errors.length > 0) {
        setRows((prev) =>
          prev.map((row) => {
            const serverErrors = result.errors.filter(
              (e) => e.rowNumber === row.rowNumber
            );
            if (serverErrors.length === 0) return row;
            return {
              ...row,
              status: "invalid" as const,
              errors: [...row.errors, ...serverErrors],
            };
          })
        );
      }

      if (result.importedCount > 0 && result.failedCount === 0) {
        toast.success(`Imported ${result.importedCount} leave request(s).`);
      } else if (result.importedCount > 0) {
        toast.warning(
          `Imported ${result.importedCount}; ${result.failedCount} failed.`
        );
      } else {
        toast.error(`Import failed for ${result.failedCount} row(s).`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Leave import failed."
      );
    } finally {
      setIsImporting(false);
    }
  }, [rows]);

  const value = useMemo(
    () => ({
      rows,
      fileName,
      importResult,
      isImporting,
      blankRowsSkipped,
      validCount,
      invalidCount,
      totalCount,
      canExecute,
      setFileFromText,
      clearFile,
      executeImport,
    }),
    [
      rows,
      fileName,
      importResult,
      isImporting,
      blankRowsSkipped,
      validCount,
      invalidCount,
      totalCount,
      canExecute,
      setFileFromText,
      clearFile,
      executeImport,
    ]
  );

  return (
    <LeaveImportContext.Provider value={value}>
      {children}
    </LeaveImportContext.Provider>
  );
}

export function useLeaveImport() {
  const ctx = useContext(LeaveImportContext);
  if (!ctx) {
    throw new Error("useLeaveImport must be used within LeaveImportProvider");
  }
  return ctx;
}
