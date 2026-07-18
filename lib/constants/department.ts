import type {
  DepartmentFilters,
  DepartmentFormData,
} from "@/types/department";

export const DEPARTMENT_PAGE_SIZE = 10;

export const DEPARTMENT_SEARCH_PLACEHOLDER =
  "Search departments by name, code, manager...";

export const DEFAULT_DEPARTMENT_FILTERS: DepartmentFilters = {
  search: "",
  status: "ALL",
  parentDepartment: "ALL",
  sortBy: "name",
  sortOrder: "asc",
};

export const DEFAULT_DEPARTMENT_FORM_VALUES: DepartmentFormData = {
  code: "",
  name: "",
  description: "",
  status: "ACTIVE",
  parentDepartmentId: null,
  headEmployeeId: null,
  managerEmployeeId: null,
  allocatedBudget: 0,
};

export const DEPARTMENT_TABLE_COLUMNS = [
  "Department",
  "Code",
  "Head",
  "Manager",
  "Employees",
  "Budget",
  "Status",
  "Actions",
] as const;

export const DEPARTMENT_SORT_OPTIONS = [
  {
    label: "Department Name",
    value: "name",
  },
  {
    label: "Department Code",
    value: "code",
  },
  {
    label: "Employee Count",
    value: "employeeCount",
  },
  {
    label: "Budget",
    value: "budget",
  },
  {
    label: "Created Date",
    value: "createdAt",
  },
] as const;

export const DEPARTMENT_SUMMARY_CARDS = [
  {
    key: "totalDepartments",
    title: "Total Departments",
  },
  {
    key: "activeDepartments",
    title: "Active Departments",
  },
  {
    key: "inactiveDepartments",
    title: "Inactive Departments",
  },
  {
    key: "totalEmployees",
    title: "Department Employees",
  },
  {
    key: "totalBudget",
    title: "Total Budget",
  },
] as const;

export const DEPARTMENT_STATUS_VARIANTS = {
  ACTIVE: "default",
  INACTIVE: "secondary",
} as const;

export const DEFAULT_CURRENCY = "INR";