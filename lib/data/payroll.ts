/**
 * Thin payroll data adapter.
 * Mock vs real is decided inside app/actions/payroll.ts ("use server").
 */

import type {
  PayrollRecord,
  PayrollSummary,
  PayrollStats,
} from "@/types/payroll";
import type { PayrollListResult } from "@/lib/services/payroll.service";
import type {
  CreatePayrollInput,
  UpdatePayrollInput,
} from "@/lib/validation/payroll";
import {
  listPayrollRecordsAction,
  getPayrollRecordAction,
  getPayrollStatsAction,
  createPayrollAction,
  updatePayrollAction,
} from "@/app/actions/payroll";

export async function fetchPayrollRecords(filters?: {
  search?: string;
  status?: string;
  month?: string;
  year?: number;
  departmentId?: string;
  employeeId?: string;
  page?: number;
  pageSize?: number;
}): Promise<PayrollListResult> {
  const result = await listPayrollRecordsAction(filters);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function fetchPayrollRecord(
  id: string
): Promise<PayrollRecord | null> {
  const result = await getPayrollRecordAction(id);
  if (!result.success) return null;
  return result.data;
}

export async function fetchPayrollStats(): Promise<{
  summary: PayrollSummary;
  stats: PayrollStats;
}> {
  const result = await getPayrollStatsAction();
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function savePayroll(
  input: CreatePayrollInput
): Promise<PayrollRecord> {
  const result = await createPayrollAction(input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function patchPayroll(
  id: string,
  input: UpdatePayrollInput
): Promise<PayrollRecord> {
  const result = await updatePayrollAction(id, input);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
