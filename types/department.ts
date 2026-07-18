import type { Employee } from "./employee";

/* -------------------------------------------------------------------------- */
/*                                Value Arrays                                */
/* -------------------------------------------------------------------------- */

export const DEPARTMENT_STATUS_VALUES = [
  "ACTIVE",
  "INACTIVE",
] as const;

export const DEPARTMENT_SORT_FIELDS = [
  "name",
  "code",
  "employeeCount",
  "budget",
  "createdAt",
] as const;

export const DEPARTMENT_SORT_ORDERS = [
  "asc",
  "desc",
] as const;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type DepartmentStatus =
  (typeof DEPARTMENT_STATUS_VALUES)[number];

export type DepartmentSortField =
  (typeof DEPARTMENT_SORT_FIELDS)[number];

export type DepartmentSortOrder =
  (typeof DEPARTMENT_SORT_ORDERS)[number];

/* -------------------------------------------------------------------------- */
/*                              Supporting Models                             */
/* -------------------------------------------------------------------------- */

export interface DepartmentBudget {
  allocated: number;
  utilized: number;
  remaining: number;
  currency: string;
}

export interface DepartmentStatistics {
  employeeCount: number;
  attendanceRate: number;
  pendingLeaves: number;
  monthlyPayroll: number;
}

export interface DepartmentOverview {
  attendanceRate: number;
  pendingLeaves: number;
  approvedLeaves: number;
  monthlyPayroll: number;
  averageSalary: number;
}

export interface DepartmentMember {
  employeeId: string;
  joinedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                              Core Department                               */
/* -------------------------------------------------------------------------- */

export interface Department {
  id: string;

  code: string;

  name: string;

  description: string;

  status: DepartmentStatus;

  parentDepartmentId: string | null;

  headEmployeeId: string | null;

  managerEmployeeId: string | null;

  members: DepartmentMember[];

  budget: DepartmentBudget;

  statistics: DepartmentStatistics;

  createdAt: string;

  updatedAt: string;
}
export interface ResolvedDepartment extends Department {
  employeeCount: number;

  headEmployee: Employee | null;

  managerEmployee: Employee | null;

  resolvedMembers: Employee[];

  activeMembers: Employee[];

  inactiveMembers: Employee[];
}
/* -------------------------------------------------------------------------- */
/*                             Dashboard Summary                              */
/* -------------------------------------------------------------------------- */

export interface DepartmentSummary {
  totalDepartments: number;

  activeDepartments: number;

  inactiveDepartments: number;

  totalEmployees: number;

  totalBudget: number;
}

/* -------------------------------------------------------------------------- */
/*                                Table Model                                 */
/* -------------------------------------------------------------------------- */

export interface DepartmentTableRow {
  id: string;

  code: string;

  name: string;

  headName: string;

  managerName: string;

  employeeCount: number;

  budget: number;

  status: DepartmentStatus;
}

/* -------------------------------------------------------------------------- */
/*                                  Filters                                   */
/* -------------------------------------------------------------------------- */

export interface DepartmentFilters {
  search: string;

  status: DepartmentStatus | "ALL";

  parentDepartment: string | "ALL";

  sortBy: DepartmentSortField;

  sortOrder: DepartmentSortOrder;
}

/* -------------------------------------------------------------------------- */
/*                               Form Contracts                               */
/* -------------------------------------------------------------------------- */

export interface DepartmentFormData {
  code: string;

  name: string;

  description: string;

  status: DepartmentStatus;

  parentDepartmentId: string | null;

  headEmployeeId: string | null;

  managerEmployeeId: string | null;

  allocatedBudget: number;
}

export interface DepartmentFormProps {
  initialData?: Department;

  availableEmployees: Employee[];

  availableDepartments: Department[];

  onSubmit: (values: DepartmentFormData) => void | Promise<void>;

  isSubmitting?: boolean;
}
