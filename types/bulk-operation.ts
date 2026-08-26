/**
 * Bulk employee operations — only actions that are implemented end-to-end.
 */

export const BULK_EMPLOYEE_ACTIONS = [
  "activate",
  "deactivate",
  "transfer-dept",
  "assign-manager",
] as const;

export type BulkEmployeeAction = (typeof BULK_EMPLOYEE_ACTIONS)[number];

export const BULK_EMPLOYEE_COMING_SOON = [
  "update-designation",
  "approve-leave",
  "reject-leave",
  "generate-payroll",
  "assign-shift",
] as const;

export type BulkEmployeeComingSoonAction =
  (typeof BULK_EMPLOYEE_COMING_SOON)[number];

/** Max employees per bulk request. */
export const BULK_EMPLOYEE_MAX_BATCH = 100;

export interface BulkEmployeeOperationInput {
  action: BulkEmployeeAction;
  employeeIds: string[];
  /** Required when action is transfer-dept */
  targetDepartmentId?: string | null;
  /** Required when action is assign-manager */
  targetManagerId?: string | null;
}

export type BulkPreviewRowStatus = "valid" | "invalid" | "warning" | "skipped";

export interface BulkEmployeePreviewRow {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  currentValue: string;
  newValue: string;
  status: BulkPreviewRowStatus;
  notes: string;
}

export interface BulkEmployeePreviewResult {
  action: BulkEmployeeAction;
  rows: BulkEmployeePreviewRow[];
  selectedCount: number;
  validCount: number;
  invalidCount: number;
  warningCount: number;
  skippedCount: number;
  canCommit: boolean;
}

export interface BulkEmployeeExecuteResult {
  action: BulkEmployeeAction;
  processedCount: number;
  failedCount: number;
  totalRequested: number;
  errors: { employeeId: string; message: string }[];
}

/**
 * UI row for Bulk Job History.
 * Derived from AuditLog — not a separate Prisma job model.
 */
export type BulkJobHistoryStatus =
  | "Completed"
  | "Running"
  | "Queued"
  | "Failed"
  | "Cancelled";

export interface BulkJobHistoryRow {
  jobId: string;
  operation: string;
  module: string;
  requestedBy: string;
  requestedOn: string;
  /** Not stored on AuditLog; real mode uses "—". */
  duration: string;
  status: BulkJobHistoryStatus;
  affectedRecords: string;
}

/** sessionStorage key for cross-page employee selection */
export const BULK_SELECTED_EMPLOYEE_IDS_KEY =
  "konark_bulk_selected_employee_ids";
