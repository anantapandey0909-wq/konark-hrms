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
import {
  executePayrollImport,
  previewPayrollImportBatch,
} from "@/lib/data/payroll-import";
import type { PayrollImportResult } from "@/lib/validation/payroll-import";

interface PayrollImportContextValue {
  rows: ParsedPayrollImportRow[];
  fileName: string | null;
  importResult: PayrollImportResult | null;
  isImporting: boolean;
  isValidating: boolean;
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

function mergeServerErrors(
  prev: ParsedPayrollImportRow[],
  serverErrors: { rowNumber: number; field?: string; message: string }[]
): ParsedPayrollImportRow[] {
  if (serverErrors.length === 0) return prev;
  return prev.map((row) => {
    const matched = serverErrors.filter((e) => e.rowNumber === row.rowNumber);
    if (matched.length === 0) return row;
    return {
      ...row,
      status: "invalid" as const,
      errors: [...row.errors, ...matched],
    };
  });
}

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
  const [isValidating, setIsValidating] = useState(false);
  const [blankRowsSkipped, setBlankRowsSkipped] = useState(0);

  const validCount = rows.filter((r) => r.status === "valid").length;
  const invalidCount = rows.filter((r) => r.status === "invalid").length;
  const totalCount = rows.length;
  // All-or-nothing: every row must be valid before commit is allowed.
  const canExecute =
    totalCount > 0 &&
    invalidCount === 0 &&
    validCount === totalCount &&
    !isImporting &&
    !isValidating;

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

    const clientValid = parsed.rows.filter(
      (r) => r.status === "valid" && r.data
    );
    if (clientValid.length === 0) {
      toast.warning(
        "Loaded " +
          parsed.rows.length +
          " row(s) from " +
          name +
          ", but none passed client validation."
      );
      return;
    }

    setIsValidating(true);
    void (async () => {
      try {
        const preview = await previewPayrollImportBatch({
          rows: clientValid.map((r) => r.data!),
        });
        if (preview.errors.length > 0) {
          setRows((prev) => mergeServerErrors(prev, preview.errors));
          toast.warning(
            "Server validation found " +
              preview.invalidCount +
              " invalid row(s). Fix or re-upload before importing."
          );
        } else {
          const blankNote =
            parsed.blankRowsSkipped > 0
              ? " (" + parsed.blankRowsSkipped + " blank row(s) skipped)"
              : "";
          toast.success(
            "Loaded and validated " +
              preview.validCount +
              " row(s) from " +
              name +
              blankNote +
              "."
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Server validation failed."
        );
      } finally {
        setIsValidating(false);
      }
    })();
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

    if (rows.some((r) => r.status === "invalid")) {
      toast.error(
        "Resolve all invalid rows before importing. Partial import is not allowed."
      );
      return;
    }

    const confirmed = window.confirm(
      "You are about to create " +
        validRows.length +
        " payroll record(s) as DRAFT.\n" +
        "This action cannot be partially completed."
    );
    if (!confirmed) return;

    setIsImporting(true);
    try {
      const result = await executePayrollImport({ rows: validRows });
      setImportResult(result);

      if (result.errors.length > 0) {
        setRows((prev) => mergeServerErrors(prev, result.errors));
      }

      if (result.success && result.importedCount > 0) {
        toast.success(
          result.importedCount === 1
            ? "1 payroll record imported successfully."
            : result.importedCount +
                " payroll records imported successfully."
        );
      } else {
        toast.error(
          result.failedCount > 0
            ? "Import blocked: " +
                result.failedCount +
                " row(s) failed validation. No payroll records were created."
            : "Import failed. No payroll records were created."
        );
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
      isValidating,
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
      isValidating,
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
