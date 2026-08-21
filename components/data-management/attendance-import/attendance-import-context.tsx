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
  parseAttendanceImportCsv,
  type ParsedAttendanceImportRow,
} from "@/lib/data-management/parse-attendance-import";
import { executeAttendanceImport } from "@/lib/data/attendance-import";
import type { AttendanceImportResult } from "@/lib/validation/attendance-import";

interface AttendanceImportContextValue {
  rows: ParsedAttendanceImportRow[];
  fileName: string | null;
  importResult: AttendanceImportResult | null;
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

const AttendanceImportContext =
  createContext<AttendanceImportContextValue | null>(null);

export function AttendanceImportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState<ParsedAttendanceImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importResult, setImportResult] =
    useState<AttendanceImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [blankRowsSkipped, setBlankRowsSkipped] = useState(0);

  const validCount = rows.filter((r) => r.status === "valid").length;
  const invalidCount = rows.filter((r) => r.status === "invalid").length;
  const totalCount = rows.length;
  const canExecute = validCount > 0 && !isImporting;

  const setFileFromText = useCallback((name: string, text: string) => {
    const parsed = parseAttendanceImportCsv(text);
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
      const result = await executeAttendanceImport({ rows: validRows });
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
        toast.success(`Imported ${result.importedCount} attendance record(s).`);
      } else if (result.importedCount > 0) {
        toast.warning(
          `Imported ${result.importedCount}; ${result.failedCount} failed.`
        );
      } else {
        toast.error(`Import failed for ${result.failedCount} row(s).`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Attendance import failed."
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
    <AttendanceImportContext.Provider value={value}>
      {children}
    </AttendanceImportContext.Provider>
  );
}

export function useAttendanceImport() {
  const ctx = useContext(AttendanceImportContext);
  if (!ctx) {
    throw new Error(
      "useAttendanceImport must be used within AttendanceImportProvider"
    );
  }
  return ctx;
}
