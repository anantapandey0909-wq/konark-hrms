import type { Employee, EmployeeStatus, EmploymentType } from "@/types/employee";

export interface EmployeeStats {
  totalEmployees: number;
  activeCount: number;
  inactiveCount: number;
  onLeaveCount: number;
  terminatedCount: number;
  fullTimeCount: number;
  partTimeCount: number;
  contractCount: number;
  internCount: number;
}

export const getEmployeeStats = (employees: Employee[]): EmployeeStats => {
  let activeCount = 0;
  let inactiveCount = 0;
  let onLeaveCount = 0;
  let terminatedCount = 0;

  let fullTimeCount = 0;
  let partTimeCount = 0;
  let contractCount = 0;
  let internCount = 0;

  employees.forEach((emp) => {
    switch (emp.status) {
      case "ACTIVE":
        activeCount++;
        break;
      case "INACTIVE":
        inactiveCount++;
        break;
      case "ON_LEAVE":
        onLeaveCount++;
        break;
      case "TERMINATED":
        terminatedCount++;
        break;
    }

    switch (emp.employmentType) {
      case "FULL_TIME":
        fullTimeCount++;
        break;
      case "PART_TIME":
        partTimeCount++;
        break;
      case "CONTRACT":
        contractCount++;
        break;
      case "INTERN":
        internCount++;
        break;
    }
  });

  return {
    totalEmployees: employees.length,
    activeCount,
    inactiveCount,
    onLeaveCount,
    terminatedCount,
    fullTimeCount,
    partTimeCount,
    contractCount,
    internCount,
  };
};

export interface DepartmentDistribution {
  departmentId: string;
  count: number;
}

export const getDepartmentDistribution = (employees: Employee[]): DepartmentDistribution[] => {
  const map = new Map<string, number>();

  employees.forEach((emp) => {
    const deptId = emp.departmentId ?? "unassigned";
    map.set(deptId, (map.get(deptId) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([departmentId, count]) => ({
    departmentId,
    count,
  }));
};

export interface StatusDistribution {
  status: EmployeeStatus;
  count: number;
}

export const getStatusDistribution = (employees: Employee[]): StatusDistribution[] => {
  const map = new Map<EmployeeStatus, number>();

  employees.forEach((emp) => {
    map.set(emp.status, (map.get(emp.status) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([status, count]) => ({
    status,
    count,
  }));
};

export interface EmploymentTypeDistribution {
  employmentType: EmploymentType;
  count: number;
}

export const getEmploymentTypeDistribution = (employees: Employee[]): EmploymentTypeDistribution[] => {
  const map = new Map<EmploymentType, number>();

  employees.forEach((emp) => {
    map.set(emp.employmentType, (map.get(emp.employmentType) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([employmentType, count]) => ({
    employmentType,
    count,
  }));
};

export interface RecentHireMetric {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  joiningDate: string;
  workLocation: string;
}

export const getRecentHires = (employees: Employee[], limit = 5): RecentHireMetric[] => {
  return [...employees]
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
    .slice(0, limit)
    .map((emp) => ({
      id: emp.id,
      employeeId: emp.employeeId,
      name: `${emp.firstName} ${emp.lastName}`,
      designation: emp.designation,
      joiningDate: emp.joiningDate,
      workLocation: emp.workLocation ?? "Remote",
    }));
};