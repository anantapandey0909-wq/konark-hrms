export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

/**
 * Read-only runtime definitions to support dropdown forms, filter components,
 * and database mapping lookups.
 */
export const EMPLOYEE_STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"] as const;

export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"] as const;

/**
 * Core Employee entity partition schema.
 * Bound strictly to a single Tenant partition key to enforce strict data isolation.
 */
export interface Employee {
  readonly id: string;
  readonly tenantId: string; // Partition key for multi-tenant database indexing
  readonly employeeId: string; // Corporate identification number (e.g., EMP-202)
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly avatarUrl: string | null; // Path or URL to the employee avatar image
  readonly departmentId: string | null; // Associated department identifier
  readonly managerId: string | null; // Reports-to employee identifier supporting approval workflows
  readonly designation: string; // Job title (e.g., Senior Software Engineer)
  readonly status: EmployeeStatus;
  readonly employmentType: EmploymentType;
  readonly workLocation: string | null; // Allocated workspace or office location (e.g., "Remote", "Pune Office")
  readonly joiningDate: string; // ISO format (YYYY-MM-DD)
  readonly relievingDate: string | null; // Exit date, ISO format (YYYY-MM-DD)
  readonly createdAt: string; // ISO-8601 string
  readonly updatedAt: string; // ISO-8601 string
}

/**
 * Utility shapes designed for client-side forms and request serialization.
 */
export type CreateEmployeeInput = Omit<Employee, "id" | "createdAt" | "updatedAt">;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;