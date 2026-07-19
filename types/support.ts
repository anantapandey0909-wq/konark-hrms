/**
 * ============================================================================
 * Konark HRMS - Support Module Types
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

export const SUPPORT_STATUS_VALUES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_EMPLOYEE",
  "RESOLVED",
  "CLOSED",
] as const;

export const SUPPORT_PRIORITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export const SUPPORT_CATEGORY_VALUES = [
  "ATTENDANCE",
  "LEAVE",
  "PAYROLL",
  "EMPLOYEE_PROFILE",
  "DEPARTMENT",
  "DOCUMENTS",
  "ACCOUNT_ACCESS",
  "IT_SUPPORT",
  "GENERAL",
] as const;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type SupportStatus = (typeof SUPPORT_STATUS_VALUES)[number];

export type SupportPriority = (typeof SUPPORT_PRIORITY_VALUES)[number];

export type SupportCategory = (typeof SUPPORT_CATEGORY_VALUES)[number];

/* -------------------------------------------------------------------------- */
/*                              Employee Summary                              */
/* -------------------------------------------------------------------------- */

export interface SupportEmployee {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Timeline Events                               */
/* -------------------------------------------------------------------------- */

export interface SupportTimelineEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

/* -------------------------------------------------------------------------- */
/*                               Support Ticket                               */
/* -------------------------------------------------------------------------- */

export interface SupportTicket {
  id: string;

  ticketNumber: string;

  subject: string;

  description: string;

  employeeId: string;

  employeeName: string;

  employeeAvatar?: string;

  employee?: SupportEmployee;

  department: string;

  category: SupportCategory;

  priority: SupportPriority;

  status: SupportStatus;

  assignedTo?: string;

  resolutionNotes?: string;

  createdAt: string;

  updatedAt: string;

  timeline: SupportTimelineEvent[];
}

/* -------------------------------------------------------------------------- */
/*                                Filter State                                */
/* -------------------------------------------------------------------------- */

export interface SupportFiltersState {
  search: string;

  status: SupportStatus | "ALL";

  priority: SupportPriority | "ALL";

  category: SupportCategory | "ALL";

  sortBy:
    | "createdAt"
    | "updatedAt"
    | "priority"
    | "status"
    | "employeeName";

  sortOrder: "asc" | "desc";
}

/* -------------------------------------------------------------------------- */
/*                             Default Filters                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_SUPPORT_FILTERS: SupportFiltersState = {
  search: "",
  status: "ALL",
  priority: "ALL",
  category: "ALL",
  sortBy: "updatedAt",
  sortOrder: "desc",
};

/* -------------------------------------------------------------------------- */
/*                              Dashboard Metrics                             */
/* -------------------------------------------------------------------------- */

export interface SupportMetrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}