import { z } from "zod";

/** Hard server-side ceiling for synchronous export generation. */
export const MAX_EXPORT_ROWS = 10_000;

/** Sample rows returned by read-only preview. */
export const EXPORT_PREVIEW_SAMPLE_ROWS = 5;

export const exportModuleSchema = z.enum([
  "employees",
  "departments",
  "attendance",
  "leave",
  "payroll",
  "reports",
]);

export type ExportModule = z.infer<typeof exportModuleSchema>;

/** Formats that can actually be generated without extra dependencies. */
export const exportFormatSchema = z.enum(["csv", "json", "xlsx"]);

export type ExportFormat = z.infer<typeof exportFormatSchema>;

export const exportFiltersSchema = z
  .object({
    status: z.string().trim().max(50).optional(),
    departmentId: z.string().trim().max(100).optional(),
    employeeId: z.string().trim().max(100).optional(),
    month: z.string().trim().max(20).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    startDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    endDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    search: z.string().trim().max(100).optional(),
  })
  .strict()
  .optional();

export type ExportFilters = z.infer<typeof exportFiltersSchema>;

export const exportRequestSchema = z
  .object({
    module: exportModuleSchema,
    format: exportFormatSchema,
    filters: exportFiltersSchema,
  })
  .strict();

export type ExportRequestInput = z.infer<typeof exportRequestSchema>;

export interface ExportColumn {
  key: string;
  label: string;
}

export interface ExportPreviewResult {
  module: ExportModule;
  format: ExportFormat;
  totalRows: number;
  exceedsLimit: boolean;
  maxRows: number;
  estimatedBytes: number;
  columns: ExportColumn[];
  sampleRows: Record<string, string>[];
  generatedAt: string;
  canExport: boolean;
  message?: string;
}

export interface ExportGenerateResult {
  success: boolean;
  exportId: string;
  filename: string;
  mimeType: string;
  /** Base64 payload for browser download (bounded size only). */
  contentBase64: string;
  recordCount: number;
  byteLength: number;
  module: ExportModule;
  format: ExportFormat;
  generatedAt: string;
}

export interface ExportHistoryItem {
  exportId: string;
  module: string;
  format: string;
  requestedBy: string;
  date: string;
  status: "Completed" | "Failed";
  size: string;
  recordCount?: number;
}

export interface ExportModuleSummary {
  id: ExportModule;
  name: string;
  description: string;
  recordCount: number | null;
  lastExportAt: string | null;
  available: boolean;
}
