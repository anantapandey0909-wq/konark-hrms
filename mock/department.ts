import { mockEmployees } from "@/mock/employee";
import type { Employee } from "@/types/employee";
import type {
  DepartmentBudget,
  DepartmentStatistics,
  DepartmentMember,
  ResolvedDepartment,
  DepartmentSummary,
  DepartmentStatus,
} from "@/types/department";

interface GroupedMembers {
  readonly resolvedMembers: Employee[];
  readonly activeMembers: Employee[];
  readonly inactiveMembers: Employee[];
  readonly members: DepartmentMember[];
}

interface BaseDepartmentSeed {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly status: DepartmentStatus;
  readonly parentDepartmentId: string | null;
  readonly headEmployeeId: string | null;
  readonly managerEmployeeId: string | null;
  readonly allocatedBudget: number;
  readonly utilizedBudget: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

const baseDepartmentSeeds: readonly BaseDepartmentSeed[] = [
  {
    id: "dept-eng",
    code: "ENG",
    name: "Engineering",
    description: "Core software engineering, QA, platform development, and site reliability engineering.",
    status: "ACTIVE",
    headEmployeeId: "emp-101",
    managerEmployeeId: "emp-102",
    parentDepartmentId: null,
    allocatedBudget: 1850000,
    utilizedBudget: 1635400,
    createdAt: "2021-01-10T09:00:00Z",
    updatedAt: "2026-01-15T15:30:00Z",
  },
  {
    id: "dept-prd",
    code: "PRD",
    name: "Product",
    description: "Product management, strategic mapping, features prioritization, and metrics tracking.",
    status: "ACTIVE",
    headEmployeeId: "emp-103",
    managerEmployeeId: "emp-104",
    parentDepartmentId: null,
    allocatedBudget: 850000,
    utilizedBudget: 775200,
    createdAt: "2021-03-12T10:00:00Z",
    updatedAt: "2026-02-10T11:20:00Z",
  },
  {
    id: "dept-dsg",
    code: "DSN",
    name: "Design",
    description: "User experience (UX), user interface (UI), brand design, and rapid visual prototyping.",
    status: "ACTIVE",
    headEmployeeId: "emp-105",
    managerEmployeeId: "emp-106",
    parentDepartmentId: "dept-prd",
    allocatedBudget: 540000,
    utilizedBudget: 426100,
    createdAt: "2021-06-01T08:30:00Z",
    updatedAt: "2025-12-05T14:15:00Z",
  },
  {
    id: "dept-mkt",
    code: "MKT",
    name: "Marketing",
    description: "Corporate positioning, demand generation, content creation, and digital ad operations.",
    status: "ACTIVE",
    headEmployeeId: "emp-107",
    managerEmployeeId: "emp-108",
    parentDepartmentId: null,
    allocatedBudget: 920000,
    utilizedBudget: 778300,
    createdAt: "2022-02-15T09:15:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "dept-sls",
    code: "SLS",
    name: "Sales",
    description: "Direct enterprise sales, accounts management, business dev, and customer acquisitions.",
    status: "ACTIVE",
    headEmployeeId: "emp-109",
    managerEmployeeId: "emp-110",
    parentDepartmentId: null,
    allocatedBudget: 1250000,
    utilizedBudget: 1188750,
    createdAt: "2022-04-10T08:00:00Z",
    updatedAt: "2026-04-12T09:45:00Z",
  },
  {
    id: "dept-ops",
    code: "OPS",
    name: "Operations",
    description: "General corporate systems administration, IT service desk, facilities, and physical offices.",
    status: "ACTIVE",
    headEmployeeId: "emp-111",
    managerEmployeeId: "emp-112",
    parentDepartmentId: null,
    allocatedBudget: 720000,
    utilizedBudget: 585360,
    createdAt: "2021-02-20T10:30:00Z",
    updatedAt: "2025-11-20T16:00:00Z",
  },
  {
    id: "dept-fin",
    code: "FIN",
    name: "Finance",
    description: "Corporate bookkeeping, statutory tax filings, run compliance, and accounts ledger balancing.",
    status: "ACTIVE",
    headEmployeeId: "emp-113",
    managerEmployeeId: "emp-114",
    parentDepartmentId: null,
    allocatedBudget: 450000,
    utilizedBudget: 342900,
    createdAt: "2021-05-05T09:00:00Z",
    updatedAt: "2026-01-20T11:00:00Z",
  },
  {
    id: "dept-hr",
    code: "HR",
    name: "HR",
    description: "People operations, employee experience, workspace onboarding, and strategic talent acquisition.",
    status: "ACTIVE",
    headEmployeeId: "emp-115",
    managerEmployeeId: "emp-116",
    parentDepartmentId: null,
    allocatedBudget: 380000,
    utilizedBudget: 315780,
    createdAt: "2021-01-25T08:45:00Z",
    updatedAt: "2026-05-18T13:10:00Z",
  },
];

const getGroupedMembers = (departmentName: string): GroupedMembers => {
  const resolvedMembers: Employee[] = [];
  const activeMembers: Employee[] = [];
  const inactiveMembers: Employee[] = [];
  const members: DepartmentMember[] = [];

  for (const emp of mockEmployees) {
    if (emp.department.toLowerCase() === departmentName.toLowerCase()) {
      resolvedMembers.push(emp);
      
      const joinedAt = emp.joiningDate || "2025-01-01";
      members.push({
        employeeId: emp.id,
        joinedAt,
      });

      const normalizedStatus = emp.status.toUpperCase();
      if (normalizedStatus === "ACTIVE") {
        activeMembers.push(emp);
      } else if (normalizedStatus === "INACTIVE") {
        inactiveMembers.push(emp);
      }
    }
  }

  return {
    resolvedMembers,
    activeMembers,
    inactiveMembers,
    members,
  };
};

const resolveHeadEmployee = (
  resolvedMembers: readonly Employee[],
  preferredHeadId: string | null,
  departmentName: string
): Employee | null => {
  if (preferredHeadId) {
    const candidate = mockEmployees.find((emp: Employee) => emp.id === preferredHeadId);
    if (
      candidate &&
      candidate.department.toLowerCase() === departmentName.toLowerCase()
    ) {
      return candidate;
    }
  }

  return (
    resolvedMembers.find(
      (emp: Employee) =>
        emp.role.toLowerCase().includes("head") ||
        emp.designation.toLowerCase().includes("director") ||
        emp.designation.toLowerCase().includes("vp") ||
        emp.level === "L4" ||
        emp.level === "L3"
    ) ||
    resolvedMembers[0] ||
    null
  );
};

const resolveManagerEmployee = (
  resolvedMembers: readonly Employee[],
  preferredManagerId: string | null,
  departmentName: string
): Employee | null => {
  if (preferredManagerId) {
    const candidate = mockEmployees.find((emp: Employee) => emp.id === preferredManagerId);
    if (
      candidate &&
      candidate.department.toLowerCase() === departmentName.toLowerCase()
    ) {
      return candidate;
    }
  }

  return (
    resolvedMembers.find((emp: Employee) => emp.designation.toLowerCase().includes("manager")) ||
    resolvedMembers[1] ||
    resolvedMembers[0] ||
    null
  );
};

export const buildAttendanceSummary = (
  _departmentId: string,
  activeMembersCount: number
): number => {
  return activeMembersCount > 0 ? 94.5 : 0;
};

export const buildLeaveSummary = (
  _departmentId: string,
  activeMembersCount: number
): number => {
  return Math.min(3, Math.floor(activeMembersCount * 0.08));
};

export const buildPayrollSummary = (
  _departmentId: string,
  activeMembersCount: number
): number => {
  return activeMembersCount * 8200;
};

const buildDepartmentStatistics = (
  departmentId: string,
  employeeCount: number,
  activeMembersCount: number
): DepartmentStatistics => {
  return {
    employeeCount,
    attendanceRate: buildAttendanceSummary(departmentId, activeMembersCount),
    pendingLeaves: buildLeaveSummary(departmentId, activeMembersCount),
    monthlyPayroll: buildPayrollSummary(departmentId, activeMembersCount),
  };
};

export const mockDepartments: ResolvedDepartment[] = baseDepartmentSeeds.map((seed) => {
  const { resolvedMembers, activeMembers, inactiveMembers, members } = getGroupedMembers(seed.name);

  const headEmployee = resolveHeadEmployee(resolvedMembers, seed.headEmployeeId, seed.name);
  const managerEmployee = resolveManagerEmployee(resolvedMembers, seed.managerEmployeeId, seed.name);

  const budget: DepartmentBudget = {
    allocated: seed.allocatedBudget,
    utilized: seed.utilizedBudget,
    remaining: seed.allocatedBudget - seed.utilizedBudget,
    currency: "USD",
  };

  const statistics = buildDepartmentStatistics(seed.id, resolvedMembers.length, activeMembers.length);

  return {
    id: seed.id,
    code: seed.code,
    name: seed.name,
    description: seed.description,
    status: seed.status,
    parentDepartmentId: seed.parentDepartmentId,
    headEmployeeId: headEmployee?.id ?? null,
    managerEmployeeId: managerEmployee?.id ?? null,
    members,
    budget,
    statistics,
    createdAt: seed.createdAt,
    updatedAt: seed.updatedAt,
    employeeCount: resolvedMembers.length,
    headEmployee,
    managerEmployee,
    resolvedMembers,
    activeMembers,
    inactiveMembers,
  };
});

export const getDepartmentById = (id: string): ResolvedDepartment | undefined => {
  return mockDepartments.find((dept) => dept.id === id);
};

export const getDepartmentEmployees = (id: string): Employee[] => {
  return getDepartmentById(id)?.resolvedMembers ?? [];
};

export const getDepartmentHead = (id: string): Employee | null => {
  return getDepartmentById(id)?.headEmployee ?? null;
};

export const getDepartmentManager = (id: string): Employee | null => {
  return getDepartmentById(id)?.managerEmployee ?? null;
};

export const getDepartmentStatistics = (id: string): DepartmentStatistics | undefined => {
  return getDepartmentById(id)?.statistics;
};

export const getChildDepartments = (id: string): ResolvedDepartment[] => {
  return mockDepartments.filter((dept) => dept.parentDepartmentId === id);
};

export const getActiveDepartments = (): ResolvedDepartment[] => {
  return mockDepartments.filter((dept) => dept.status === "ACTIVE");
};

export const getInactiveDepartments = (): ResolvedDepartment[] => {
  return mockDepartments.filter((dept) => dept.status === "INACTIVE");
};

export const mockDepartmentSummary: DepartmentSummary = {
  get totalDepartments(): number {
    return mockDepartments.length;
  },
  get activeDepartments(): number {
    return mockDepartments.filter((d) => d.status === "ACTIVE").length;
  },
  get inactiveDepartments(): number {
    return mockDepartments.filter((d) => d.status === "INACTIVE").length;
  },
  get totalEmployees(): number {
    return mockDepartments.reduce((acc, d) => acc + d.employeeCount, 0);
  },
  get totalBudget(): number {
    return mockDepartments.reduce((acc, d) => acc + d.budget.allocated, 0);
  },
};