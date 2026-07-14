import type { 
  AttendanceRecord, 
  AttendanceSummary, 
  EmployeeAttendanceSummary 
} from "@/types/attendance";

/**
 * Standard daily work hours configuration boundary.
 */
const STANDARD_WORK_HOURS = 8;

/**
 * Helper to handle floating-point rounding precision.
 * 
 * @param value - Numerical value to round.
 * @param decimals - Decimal places (defaults to 1).
 * @returns Rounded value.
 */
function round(value: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates total worked hours for an attendance record.
 * Falls back to computing differences of ISO clock metrics when not predefined.
 * 
 * @param record - Daily attendance log.
 * @returns Total worked hours as a decimal.
 */
export function calculateWorkHours(record: AttendanceRecord): number {
  if (record.workHours !== null && record.workHours !== undefined) {
    return record.workHours;
  }

  if (!record.clockInAt || !record.clockOutAt) {
    return 0;
  }

  const checkInTime = Date.parse(record.clockInAt);
  const checkOutTime = Date.parse(record.clockOutAt);

  if (isNaN(checkInTime) || isNaN(checkOutTime) || checkOutTime <= checkInTime) {
    return 0;
  }

  const diffInMs = checkOutTime - checkInTime;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return round(diffInHours, 2);
}

/**
 * Calculates overtime hours relative to standard workday configurations.
 * 
 * @param record - Daily attendance log.
 * @returns Overtime hours as a decimal.
 */
export function calculateOvertimeHours(record: AttendanceRecord): number {
  if (record.overtimeHours !== null && record.overtimeHours !== undefined) {
    return record.overtimeHours;
  }

  const workHours = calculateWorkHours(record);
  const overtime = Math.max(workHours - STANDARD_WORK_HOURS, 0);

  return round(overtime, 2);
}

/**
 * Counts status occurrences and unique personnel indexes from attendance records.
 * 
 * @param records - Array of attendance records.
 * @returns Status occurrence metrics.
 */
export function calculateAttendanceSummary(records: AttendanceRecord[]): AttendanceSummary {
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let halfDayCount = 0;
  let onLeaveCount = 0;
  const uniqueEmployeeIds = new Set<string>();

  for (const record of records) {
    if (record.employeeId) {
      uniqueEmployeeIds.add(record.employeeId);
    }

    switch (record.status) {
      case "PRESENT":
        presentCount++;
        break;
      case "LATE":
        lateCount++;
        break;
      case "ABSENT":
        absentCount++;
        break;
      case "HALF_DAY":
        halfDayCount++;
        break;
      case "ON_LEAVE":
        onLeaveCount++;
        break;
      default:
        break;
    }
  }

  return {
    presentCount,
    lateCount,
    absentCount,
    halfDayCount,
    onLeaveCount,
    totalEmployees: uniqueEmployeeIds.size,
  };
}

/**
 * Evaluates the percentage of positive daily attendance events.
 * 
 * @param records - Array of attendance records.
 * @returns Positive attendance rate decimal.
 */
export function calculateAttendanceRate(records: AttendanceRecord[]): number {
  if (records.length === 0) {
    return 0;
  }

  let attendedCount = 0;

  for (const record of records) {
    if (
      record.status === "PRESENT" ||
      record.status === "LATE" ||
      record.status === "HALF_DAY"
    ) {
      attendedCount++;
    }
  }

  const rate = (attendedCount / records.length) * 100;
  return round(rate, 1);
}

/**
 * Computes average daily work hours for employees who logged work.
 * 
 * @param records - Array of attendance records.
 * @returns Average work hours daily.
 */
export function calculateAverageWorkHours(records: AttendanceRecord[]): number {
  const activeWorkSessions = records
    .map((record) => calculateWorkHours(record))
    .filter((hours) => hours > 0);

  if (activeWorkSessions.length === 0) {
    return 0;
  }

  const sum = activeWorkSessions.reduce((total, hours) => total + hours, 0);
  const average = sum / activeWorkSessions.length;

  return round(average, 1);
}

/**
 * Sums overtime hours logged within a specified selection of records.
 * 
 * @param records - Array of attendance records.
 * @returns Sum of overtime hours.
 */
export function calculateTotalOvertime(records: AttendanceRecord[]): number {
  const total = records.reduce((sum, record) => sum + calculateOvertimeHours(record), 0);
  return round(total, 1);
}

/**
 * Builds localized metrics to summarize employee work history.
 * 
 * @param records - Full array of attendance logs.
 * @param employeeId - Unique identifier of the targeting employee.
 * @returns Summary of employee statistics.
 */
export function calculateEmployeeAttendanceSummary(
  records: AttendanceRecord[],
  employeeId: string
): EmployeeAttendanceSummary {
  const employeeRecords = records.filter((record) => record.employeeId === employeeId);

  const summary = calculateAttendanceSummary(employeeRecords);
  
  const totalWorkedHours = employeeRecords.reduce(
    (sum, record) => sum + calculateWorkHours(record),
    0
  );

  const totalOvertime = calculateTotalOvertime(employeeRecords);
  const attendanceRate = calculateAttendanceRate(employeeRecords);

  return {
    presentCount: summary.presentCount,
    lateCount: summary.lateCount,
    halfDayCount: summary.halfDayCount,
    absentCount: summary.absentCount,
    onLeaveCount: summary.onLeaveCount,
    totalWorkedHours: round(totalWorkedHours, 1),
    totalOvertime,
    attendanceRate,
  };
}
