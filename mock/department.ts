import {
  Department,
  DepartmentSummary,
  ResolvedDepartment,
} from "@/types/department";
import { mockEmployees } from "@/mock/employee";

// ==============================================================================
// Base Department Data
// ==============================================================================

export const baseDepartments: Department[] = [
  {
    id: "dept-1",
    tenantId: "tenant-konark-tech",
    name: "Engineering",
    code: "ENG",
    description:
      "Core software development, product engineering, and technical platforms.",
    managerId: "emp-101",
    parentDepartmentId: null,
    status: "ACTIVE",
    sortOrder: 1,
    budget: 850000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "dept-2",
    tenantId: "tenant-konark-tech",
    name: "Human Resources",
    code: "HR",
    description:
      "Talent acquisition, organizational development, and compliance.",
    managerId: "emp-102",
    parentDepartmentId: null,
    status: "ACTIVE",
    sortOrder: 2,
    budget: 150000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "dept-3",
    tenantId: "tenant-konark-tech",
    name: "Product Management",
    code: "PM",
    description:
      "Product roadmap planning, market analysis, and UI/UX design.",
    managerId: "emp-103",
    parentDepartmentId: null,
    status: "ACTIVE",
    sortOrder: 3,
    budget: 320000,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: "dept-4",
    tenantId: "tenant-konark-tech",
    name: "QA & Automation",
    code: "QA",
    description:
      "Quality control, automated testing pipelines, and release stability.",
    managerId: "emp-104",
    parentDepartmentId: "dept-1",
    status: "ACTIVE",
    sortOrder: 4,
    budget: 180000,
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
  {
    id: "dept-5",
    tenantId: "tenant-konark-tech",
    name: "Growth & Marketing",
    code: "MKT",
    description:
      "Global advertising campaigns and inbound demand generation.",
    managerId: null,
    parentDepartmentId: null,
    status: "INACTIVE",
    sortOrder: 5,
    budget: 110000,
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z",
  },
  {
    id: "dept-6",
    tenantId: "tenant-shakti-auto",
    name: "Operations",
    code: "OPS",
    description:
      "Industrial engineering and floor inventory operations.",
    managerId: "emp-109",
    parentDepartmentId: null,
    status: "ACTIVE",
    sortOrder: 1,
    budget: 420000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "dept-7",
    tenantId: "tenant-ayurcare",
    name: "Finance & Accounts",
    code: "FIN",
    description:
      "Ledger management, tax reconciliation, and financial strategy.",
    managerId: "emp-108",
    parentDepartmentId: null,
    status: "ACTIVE",
    sortOrder: 1,
    budget: 200000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

// ==============================================================================
// Resolved Departments
// ==============================================================================

export const mockDepartments: ResolvedDepartment[] = baseDepartments
  .map((department) => {
    const manager =
      mockEmployees.find(
        (employee) => employee.id === department.managerId
      ) ?? null;

    const parentDepartment =
      baseDepartments.find(
        (parent) => parent.id === department.parentDepartmentId
      ) ?? null;

    const employeeCount = mockEmployees.filter(
      (employee) => employee.departmentId === department.id
    ).length;

    return {
      ...department,
      manager,
      parentDepartment,
      employeeCount,
    };
  })
  .sort((first, second) => first.sortOrder - second.sortOrder);

// ==============================================================================
// Summary
// ==============================================================================

const activeDepartments = baseDepartments.filter(
  (department) => department.status === "ACTIVE"
);

const inactiveDepartments = baseDepartments.filter(
  (department) => department.status === "INACTIVE"
);

export const mockDepartmentSummary: DepartmentSummary = {
  totalDepartments: baseDepartments.length,
  activeDepartments: activeDepartments.length,
  inactiveDepartments: inactiveDepartments.length,
  totalEmployees: mockEmployees.length,
};

// ==============================================================================
// Helpers
// ==============================================================================

export function getDepartmentById(
  id: string
): ResolvedDepartment | null {
  return mockDepartments.find((department) => department.id === id) ?? null;
}

export function getDepartmentsByTenant(
  tenantId: string
): ResolvedDepartment[] {
  return mockDepartments.filter(
    (department) => department.tenantId === tenantId
  );
}

export function getDepartmentName(
  departmentId: string | null
): string {
  if (!departmentId) {
    return "N/A";
  }

  return (
    mockDepartments.find(
      (department) => department.id === departmentId
    )?.name ?? "N/A"
  );
}