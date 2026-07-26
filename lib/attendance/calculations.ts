import { Attendance, AttendanceWithEmployee } from "@/types/attendance";

export interface AttendanceStatistics {
  readonly totalRecords: number;
  readonly presentCount: number;
  readonly absentCount: number;
  readonly lateCount: number;
  readonly halfDayCount: number;
  readonly onLeaveCount: number;
  readonly attendancePercentage: number;
  readonly averageWorkingHours: number;
  readonly totalOvertimeHours: number;
}

export interface MonthlyAttendanceSummary {
  readonly yearMonth: string;
  readonly statistics: AttendanceStatistics;
}

export interface DailyAttendanceSummary {
  readonly date: string;
  readonly statistics: AttendanceStatistics;
}

export interface EmployeeAttendanceMetrics {
  readonly employeeId: string;
  readonly statistics: AttendanceStatistics;
}

export interface DepartmentAttendanceMetrics {
  readonly departmentId: string;
  readonly statistics: AttendanceStatistics;
}

/**
 * Calculates comprehensive attendance statistics for a given set of records.
 * Handles empty arrays, missing, and nullable fields safely.
 *
 * @param records Collection of attendance records
 */
export function calculateAttendanceStatistics(
  records: readonly Attendance[]
): AttendanceStatistics {
  const totalRecords = records.length;

  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      halfDayCount: 0,
      onLeaveCount: 0,
      attendancePercentage: 0,
      averageWorkingHours: 0,
      totalOvertimeHours: 0,
    };
  }

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let halfDayCount = 0;
  let onLeaveCount = 0;
  let accumulatedHours = 0;
  let validHoursRecordCount = 0;
  let totalOvertimeHours = 0;

  for (let i = 0; i < totalRecords; i++) {
    const record = records[i];

    switch (record.status) {
      case "PRESENT":
        presentCount++;
        break;
      case "ABSENT":
        absentCount++;
        break;
      case "LATE":
        lateCount++;
        break;
      case "HALF_DAY":
        halfDayCount++;
        break;
      case "ON_LEAVE":
        onLeaveCount++;
        break;
    }

    if (record.totalHours !== null && record.totalHours !== undefined) {
      accumulatedHours += record.totalHours;
      validHoursRecordCount++;
    }

    if (record.overtimeHours !== null && record.overtimeHours !== undefined) {
      totalOvertimeHours += record.overtimeHours;
    }
  }

  const attendedDaysCount = presentCount + lateCount + halfDayCount;
  const attendancePercentage = totalRecords > 0
    ? Math.round((attendedDaysCount / totalRecords) * 10000) / 100
    : 0;

  const averageWorkingHours = validHoursRecordCount > 0
    ? Math.round((accumulatedHours / validHoursRecordCount) * 100) / 100
    : 0;

  return {
    totalRecords,
    presentCount,
    absentCount,
    lateCount,
    halfDayCount,
    onLeaveCount,
    attendancePercentage,
    averageWorkingHours,
    totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
  };
}

/**
 * Returns the count of employees present, late, or half-day.
 */
export function getTotalPresentEmployees(records: readonly Attendance[]): number {
  let count = 0;
  for (let i = 0; i < records.length; i++) {
    const status = records[i].status;
    if (status === "PRESENT" || status === "LATE" || status === "HALF_DAY") {
      count++;
    }
  }
  return count;
}

/**
 * Returns the count of absent employees.
 */
export function getTotalAbsentEmployees(records: readonly Attendance[]): number {
  let count = 0;
  for (let i = 0; i < records.length; i++) {
    if (records[i].status === "ABSENT") {
      count++;
    }
  }
  return count;
}

/**
 * Returns the count of late employees.
 */
export function getTotalLateEmployees(records: readonly Attendance[]): number {
  let count = 0;
  for (let i = 0; i < records.length; i++) {
    if (records[i].status === "LATE") {
      count++;
    }
  }
  return count;
}

/**
 * Returns the count of half-day employees.
 */
export function getTotalHalfDayEmployees(records: readonly Attendance[]): number {
  let count = 0;
  for (let i = 0; i < records.length; i++) {
    if (records[i].status === "HALF_DAY") {
      count++;
    }
  }
  return count;
}

/**
 * Returns the count of employees on approved leave.
 */
export function getTotalLeaveEmployees(records: readonly Attendance[]): number {
  let count = 0;
  for (let i = 0; i < records.length; i++) {
    if (records[i].status === "ON_LEAVE") {
      count++;
    }
  }
  return count;
}

/**
 * Calculates attendance status percentage across all records.
 */
export function getAttendancePercentage(records: readonly Attendance[]): number {
  if (records.length === 0) return 0;
  const attendedCount = getTotalPresentEmployees(records);
  return Math.round((attendedCount / records.length) * 10000) / 100;
}

/**
 * Calculates average working hours safely handling nullable parameters.
 */
export function getAverageWorkingHours(records: readonly Attendance[]): number {
  let totalHours = 0;
  let count = 0;
  for (let i = 0; i < records.length; i++) {
    const hours = records[i].totalHours;
    if (hours !== null && hours !== undefined) {
      totalHours += hours;
      count++;
    }
  }
  return count > 0 ? Math.round((totalHours / count) * 100) / 100 : 0;
}

/**
 * Safely aggregates total overtime hours worked.
 */
export function getTotalOvertimeHours(records: readonly Attendance[]): number {
  let totalOvertime = 0;
  for (let i = 0; i < records.length; i++) {
    const overtime = records[i].overtimeHours;
    if (overtime !== null && overtime !== undefined) {
      totalOvertime += overtime;
    }
  }
  return Math.round(totalOvertime * 100) / 100;
}

/**
 * Safely aggregates total working hours worked.
 */
export function getTotalWorkingHours(records: readonly Attendance[]): number {
  let totalHours = 0;
  for (let i = 0; i < records.length; i++) {
    const hours = records[i].totalHours;
    if (hours !== null && hours !== undefined) {
      totalHours += hours;
    }
  }
  return Math.round(totalHours * 100) / 100;
}

/**
 * Groups and summaries records by month (YYYY-MM).
 */
export function calculateMonthlySummary(
  records: readonly Attendance[]
): readonly MonthlyAttendanceSummary[] {
  const monthlyGroups: Record<string, Attendance[]> = {};

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const month = record.attendanceDate.substring(0, 7); // YYYY-MM

    if (!monthlyGroups[month]) {
      monthlyGroups[month] = [];
    }
    monthlyGroups[month].push(record);
  }

  const months = Object.keys(monthlyGroups).sort();
  const summary: MonthlyAttendanceSummary[] = [];

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    summary.push({
      yearMonth: month,
      statistics: calculateAttendanceStatistics(monthlyGroups[month]),
    });
  }

  return summary;
}

/**
 * Groups and summaries records by date (YYYY-MM-DD).
 */
export function calculateDailySummary(
  records: readonly Attendance[]
): readonly DailyAttendanceSummary[] {
  const dailyGroups: Record<string, Attendance[]> = {};

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const date = record.attendanceDate;

    if (!dailyGroups[date]) {
      dailyGroups[date] = [];
    }
    dailyGroups[date].push(record);
  }

  const dates = Object.keys(dailyGroups).sort();
  const summary: DailyAttendanceSummary[] = [];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    summary.push({
      date,
      statistics: calculateAttendanceStatistics(dailyGroups[date]),
    });
  }

  return summary;
}

/**
 * Groups and summaries records by individual employees.
 */
export function calculateEmployeeAttendanceMetrics(
  records: readonly Attendance[]
): readonly EmployeeAttendanceMetrics[] {
  const employeeGroups: Record<string, Attendance[]> = {};

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const empId = record.employeeId;

    if (!employeeGroups[empId]) {
      employeeGroups[empId] = [];
    }
    employeeGroups[empId].push(record);
  }

  const empIds = Object.keys(employeeGroups);
  const metrics: EmployeeAttendanceMetrics[] = [];

  for (let i = 0; i < empIds.length; i++) {
    const empId = empIds[i];
    metrics.push({
      employeeId: empId,
      statistics: calculateAttendanceStatistics(employeeGroups[empId]),
    });
  }

  return metrics;
}

/**
 * Groups and summaries records by organizational department.
 */
export function calculateDepartmentAttendanceMetrics(
  records: readonly AttendanceWithEmployee[]
): readonly DepartmentAttendanceMetrics[] {
  const departmentGroups: Record<string, Attendance[]> = {};

  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    const deptId = item.employee.departmentId || "unassigned";

    if (!departmentGroups[deptId]) {
      departmentGroups[deptId] = [];
    }
    departmentGroups[deptId].push(item.attendance);
  }

  const deptIds = Object.keys(departmentGroups);
  const metrics: DepartmentAttendanceMetrics[] = [];

  for (let i = 0; i < deptIds.length; i++) {
    const deptId = deptIds[i];
    metrics.push({
      departmentId: deptId,
      statistics: calculateAttendanceStatistics(departmentGroups[deptId]),
    });
  }

  return metrics;
}