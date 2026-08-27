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
  parseEmployeeImportCsv,
  type ParsedEmployeeImportRow,
} from "@/lib/data-management/parse-employee-import";
import {
  executeEmployeeImport,
  previewEmployeeImportBatch,
} from "@/lib/data/employee-import";
import type { EmployeeImportResult } from "@/lib/validation/employee-import";

interface EmployeeImportContextValue {
  rows: ParsedEmployeeImportRow[];
  fileName: string | null;
  importResult: EmployeeImportResult | null;
  isImporting: boolean;
  isValidating: boolean;
  validCount: number;
  invalidCount: number;
  totalCount: number;
  canExecute: boolean;
  setFileFromText: (fileName: string, text: string) => void;
  clearFile: () => void;
  executeImport: () => Promise<void>;
}

const EmployeeImportContext =
  createContext<EmployeeImportContextValue | null>(null);

function mergeServerErrors(
  prev: ParsedEmployeeImportRow[],
  serverErrors: { rowNumber: number; field?: string; message: string }[]
): ParsedEmployeeImportRow[] {
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

export function EmployeeImportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState<ParsedEmployeeImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importResult, setImportResult] =
    useState<EmployeeImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

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
    const parsed = parseEmployeeImportCsv(text);
    if (parsed.parseError) {
      toast.error(parsed.parseError);
      setRows([]);
      setFileName(null);
      setImportResult(null);
      return;
    }

    setRows(parsed.rows);
    setFileName(name);
    setImportResult(null);

    const clientValid = parsed.rows.filter((r) => r.status === "valid" && r.data);
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

    // Server-side read-only validation (departments, DB duplicates).
    setIsValidating(true);
    void (async () => {
      try {
        const preview = await previewEmployeeImportBatch({
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
          toast.success(
            "Loaded and validated " +
              preview.validCount +
              " row(s) from " +
              name +
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
      "Import " +
        validRows.length +
        " employee(s)? This will create user accounts and cannot be undone from this screen."
    );
    if (!confirmed) return;

    setIsImporting(true);
    try {
      const result = await executeEmployeeImport({ rows: validRows });
      setImportResult(result);

      if (result.errors.length > 0) {
        setRows((prev) => mergeServerErrors(prev, result.errors));
      }

      if (result.success && result.importedCount > 0) {
        toast.success(
          result.importedCount === 1
            ? "1 employee imported successfully."
            : result.importedCount + " employees imported successfully."
        );
      } else {
        toast.error(
          result.failedCount > 0
            ? "Import blocked: " +
                result.failedCount +
                " row(s) failed validation. No employees were created."
            : "Import failed. No employees were created."
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Employee import failed."
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
    <EmployeeImportContext.Provider value={value}>
      {children}
    </EmployeeImportContext.Provider>
  );
}

export function useEmployeeImport() {
  const ctx = useContext(EmployeeImportContext);
  if (!ctx) {
    throw new Error(
      "useEmployeeImport must be used within EmployeeImportProvider"
    );
  }
  return ctx;
}
