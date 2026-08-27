"use server";

import { isRealDataEnabled } from "@/lib/config/flags";
import { toSafeActionResult } from "@/lib/errors/app-error";
import {
  generateExport,
  listExportHistory,
  listExportModuleSummaries,
  previewExport,
} from "@/lib/services/export.service";
import type {
  ExportGenerateResult,
  ExportHistoryItem,
  ExportModuleSummary,
  ExportPreviewResult,
  ExportRequestInput,
} from "@/lib/validation/export";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export async function listExportModulesAction(): Promise<
  ActionResult<ExportModuleSummary[]>
> {
  if (!isRealDataEnabled()) {
    return {
      success: true,
      data: [
        {
          id: "employees",
          name: "Employees",
          description: "Core profiles (mock).",
          recordCount: 0,
          lastExportAt: null,
          available: true,
        },
        {
          id: "departments",
          name: "Departments",
          description: "Departments (mock).",
          recordCount: 0,
          lastExportAt: null,
          available: true,
        },
        {
          id: "attendance",
          name: "Attendance",
          description: "Attendance (mock).",
          recordCount: 0,
          lastExportAt: null,
          available: true,
        },
        {
          id: "leave",
          name: "Leave",
          description: "Leave (mock).",
          recordCount: 0,
          lastExportAt: null,
          available: true,
        },
        {
          id: "payroll",
          name: "Payroll",
          description: "Payroll (mock).",
          recordCount: 0,
          lastExportAt: null,
          available: true,
        },
        {
          id: "reports",
          name: "Reports",
          description: "Reports snapshot (mock).",
          recordCount: 0,
          lastExportAt: null,
          available: true,
        },
      ],
    };
  }
  try {
    const data = await listExportModuleSummaries();
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function previewExportAction(
  input: ExportRequestInput
): Promise<ActionResult<ExportPreviewResult>> {
  if (!isRealDataEnabled()) {
    return {
      success: true,
      data: {
        module: input.module,
        format: input.format,
        totalRows: 0,
        exceedsLimit: false,
        maxRows: 10_000,
        estimatedBytes: 0,
        columns: [],
        sampleRows: [],
        generatedAt: new Date().toISOString(),
        canExport: false,
        message: "Mock mode: connect real data to preview exports.",
      },
    };
  }
  try {
    const data = await previewExport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function generateExportAction(
  input: ExportRequestInput
): Promise<ActionResult<ExportGenerateResult>> {
  if (!isRealDataEnabled()) {
    return {
      success: false,
      error: "Export generation requires real-data mode.",
      code: "VALIDATION",
    };
  }
  try {
    const data = await generateExport(input);
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}

export async function listExportHistoryAction(): Promise<
  ActionResult<ExportHistoryItem[]>
> {
  if (!isRealDataEnabled()) {
    return { success: true, data: [] };
  }
  try {
    const data = await listExportHistory();
    return { success: true, data };
  } catch (error) {
    return toSafeActionResult(error);
  }
}
