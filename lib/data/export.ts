/**
 * Thin export adapter. Mock vs real is decided in app/actions/export.ts.
 */

import {
  generateExportAction,
  listExportHistoryAction,
  listExportModulesAction,
  previewExportAction,
} from "@/app/actions/export";
import type {
  ExportGenerateResult,
  ExportHistoryItem,
  ExportModuleSummary,
  ExportPreviewResult,
  ExportRequestInput,
} from "@/lib/validation/export";

export async function fetchExportModules(): Promise<ExportModuleSummary[]> {
  const result = await listExportModulesAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function previewExportBatch(
  input: ExportRequestInput
): Promise<ExportPreviewResult> {
  const result = await previewExportAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function executeExport(
  input: ExportRequestInput
): Promise<ExportGenerateResult> {
  const result = await generateExportAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchExportHistory(): Promise<ExportHistoryItem[]> {
  const result = await listExportHistoryAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

/** Trigger a browser download from base64 payload. */
export function downloadBase64File(
  filename: string,
  mimeType: string,
  contentBase64: string
): void {
  const binary = atob(contentBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
