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
  parsePayrollImportCsv,
  type ParsedPayrollImportRow,
} from "@/lib/data-management/parse-payroll-import";
import { executePayrollImport } from "@/lib/data/payroll-import";
import type { PayrollImportResult } from "@/lib/validation/payroll-import";

interface PayrollImportContextValue {
  rows: ParsedPayrollImportRow[];
  fileName: string | null;
  importResult: PayrollImportResult | null;
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

const PayrollImportContext =
  createContext<PayrollImportContextValue | null>(null);

export function PayrollImportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState<ParsedPayrollImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importResult, setImportResult] =
    useState<PayrollImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [blankRowsSkipped, setBlankRowsSkipped] = useState(0);

  const validCount = rows.filter((r) => r.status === "valid").length;
  const invalidCount = rows.filter((r) => r.status === "invalid").length;
  const totalCount = rows.length;
  const canExecute = validCount > 0 && !isImporting;

  const setFileFromText = useCallback((name: string, text: string) => {
    const parsed = parsePayrollImportCsv(text);
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
      const result = await executePayrollImport({ rows: validRows });
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
        toast.success(`Imported ${result.importedCount} payroll record(s).`);
      } else if (result.importedCount > 0) {
        toast.warning(
          `Imported ${result.importedCount}; ${result.failedCount} failed.`
        );
      } else {
        toast.error(`Import failed for ${result.failedCount} row(s).`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payroll import failed."
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
    <PayrollImportContext.Provider value={value}>
      {children}
    </PayrollImportContext.Provider>
  );
}

export function usePayrollImport() {
  const ctx = useContext(PayrollImportContext);
  if (!ctx) {
    throw new Error(
      "usePayrollImport must be used within PayrollImportProvider"
    );
  }
  return ctx;
}
