import { Employee } from "@/types/employee";

export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description: string | null;
  managerId: string | null;
  parentDepartmentId: string | null;
  status: DepartmentStatus;
  sortOrder: number;
  budget: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedDepartment extends Department {
  manager: Employee | null;
  parentDepartment: Department | null;
  employeeCount: number;
}

export interface DepartmentSummary {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  totalEmployees: number;
}

export interface DepartmentFormData {
  name: string;
  code: string;
  description: string | null;
  managerId: string | null;
  parentDepartmentId: string | null;
  status: DepartmentStatus;
  sortOrder: number;
  budget: number | null;
}

export interface DepartmentFilters {
  search: string;
  status: string;
  parentDepartment: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}