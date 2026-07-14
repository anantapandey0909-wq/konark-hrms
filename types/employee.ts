export type EmployeeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ON_LEAVE"
  | "SUSPENDED";

export type EmployeeRole =
  | "ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "HR_PARTNER"
  | "DIRECTOR";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN";

export type EmployeeLevel =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5";

export type Department =
  | "Engineering"
  | "Product"
  | "Design"
  | "Marketing"
  | "Sales"
  | "HR"
  | "Finance"
  | "Operations";

export interface Employee {
  id: string;

  employeeId: string;
  employeeCode: string;

  avatar?: string | null;

  fullName: string;
  email: string;
  phone: string;

  department: Department;
  designation: string;

  role: EmployeeRole;
  level: EmployeeLevel;

  status: EmployeeStatus;

  gender: Gender;

  employmentType: EmploymentType;

  joiningDate: string;

  managerId?: string | null;
  managerName?: string | null;

  location: string;

  profileCompletion: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface EmployeeFilters {
  search: string;
  department: Department | "ALL";
  status: EmployeeStatus | "ALL";
  role: EmployeeRole | "ALL";
}
