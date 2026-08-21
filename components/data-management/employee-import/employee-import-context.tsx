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
import { executeEmployeeImport } from "@/lib/data/employee-import";
import type { EmployeeImportResult } from "@/lib/validation/employee-import";

interface EmployeeImportContextValue {
  rows: ParsedEmployeeImportRow[];
  fileName: string | null;
  importResult: EmployeeImportResult | null;
  isImporting: boolean;
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

  const validCount = rows.filter((r) => r.status === "valid").length;
  const invalidCount = rows.filter((r) => r.status === "invalid").length;
  const totalCount = rows.length;
  const canExecute = validCount > 0 && !isImporting;

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
    toast.success(`Loaded ${parsed.rows.length} row(s) from ${name}`);
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

    setIsImporting(true);
    try {
      const result = await executeEmployeeImport({ rows: validRows });
      setImportResult(result);

      // Merge server-side failures into row status display
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
        toast.success(`Imported ${result.importedCount} employee(s).`);
      } else if (result.importedCount > 0) {
        toast.warning(
          `Imported ${result.importedCount}; ${result.failedCount} failed.`
        );
      } else {
        toast.error(`Import failed for ${result.failedCount} row(s).`);
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
