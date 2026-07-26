import { Attendance, AttendanceWithEmployee } from "@/types/attendance";

export interface AttendanceFilterOptions {
  readonly employeeId?: string;
  readonly status?: string;
  readonly date?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly departmentId?: string;
  readonly searchKeyword?: string;
  readonly month?: string; // Format: YYYY-MM
  readonly year?: number; // Format: YYYY
  readonly hasOvertime?: boolean;
}

export type SortField = "date" | "employeeName" | "totalHours" | "overtimeHours" | "status";
export type SortOrder = "asc" | "desc";

/**
 * Filters standard Attendance records using a set of structured options.
 * This function is pure and returns a new immutable array.
 *
 * @param records Collection of standard attendance records
 * @param options Filtering configuration options
 */
export function filterAttendance(
  records: readonly Attendance[],
  options: AttendanceFilterOptions
): readonly Attendance[] {
  let result = [...records];

  if (options.employeeId) {
    result = result.filter((r) => r.employeeId === options.employeeId);
  }

  if (options.status && options.status !== "ALL") {
    result = result.filter((r) => r.status === options.status);
  }

  if (options.date) {
    result = result.filter((r) => r.attendanceDate === options.date);
  }

  if (options.startDate) {
    result = result.filter((r) => r.attendanceDate >= options.startDate!);
  }

  if (options.endDate) {
    result = result.filter((r) => r.attendanceDate <= options.endDate!);
  }

  if (options.month) {
    result = result.filter((r) => r.attendanceDate.startsWith(options.month!));
  }

  if (options.year) {
    const yearStr = options.year.toString();
    result = result.filter((r) => r.attendanceDate.startsWith(yearStr));
  }

  if (options.hasOvertime !== undefined) {
    if (options.hasOvertime) {
      result = result.filter((r) => r.overtimeHours !== null && r.overtimeHours > 0);
    } else {
      result = result.filter((r) => r.overtimeHours === null || r.overtimeHours === 0);
    }
  }

  return result;
}

/**
 * Filters normalized AttendanceWithEmployee records using a set of options and search query.
 * This function is pure and returns a new immutable array.
 *
 * @param records Collection of attendance records joined with employee metadata
 * @param options Filtering and keyword search options
 */
export function filterAttendanceWithEmployee(
  records: readonly AttendanceWithEmployee[],
  options: AttendanceFilterOptions
): readonly AttendanceWithEmployee[] {
  let result = [...records];

  if (options.employeeId) {
    result = result.filter((r) => r.attendance.employeeId === options.employeeId);
  }

  if (options.status && options.status !== "ALL") {
    result = result.filter((r) => r.attendance.status === options.status);
  }

  if (options.date) {
    result = result.filter((r) => r.attendance.attendanceDate === options.date);
  }

  if (options.startDate) {
    result = result.filter((r) => r.attendance.attendanceDate >= options.startDate!);
  }

  if (options.endDate) {
    result = result.filter((r) => r.attendance.attendanceDate <= options.endDate!);
  }

  if (options.month) {
    result = result.filter((r) => r.attendance.attendanceDate.startsWith(options.month!));
  }

  if (options.year) {
    const yearStr = options.year.toString();
    result = result.filter((r) => r.attendance.attendanceDate.startsWith(yearStr));
  }

  if (options.hasOvertime !== undefined) {
    if (options.hasOvertime) {
      result = result.filter((r) => r.attendance.overtimeHours !== null && r.attendance.overtimeHours > 0);
    } else {
      result = result.filter((r) => r.attendance.overtimeHours === null || r.attendance.overtimeHours === 0);
    }
  }

  if (options.departmentId && options.departmentId !== "ALL") {
    result = result.filter((r) => r.employee.departmentId === options.departmentId);
  }

  if (options.searchKeyword) {
    const query = options.searchKeyword.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.employee.firstName.toLowerCase().includes(query) ||
        r.employee.lastName.toLowerCase().includes(query) ||
        r.attendance.employeeId.toLowerCase().includes(query) ||
        r.attendance.status.toLowerCase().includes(query)
    );
  }

  return result;
}

/**
 * Filter utility specifically for picking late arrivals.
 */
export function filterByLate(records: readonly Attendance[]): readonly Attendance[] {
  return records.filter((r) => r.status === "LATE");
}

/**
 * Filter utility specifically for picking half-day records.
 */
export function filterByHalfDay(records: readonly Attendance[]): readonly Attendance[] {
  return records.filter((r) => r.status === "HALF_DAY");
}

/**
 * Filter utility specifically for picking present records.
 */
export function filterByPresent(records: readonly Attendance[]): readonly Attendance[] {
  return records.filter((r) => r.status === "PRESENT");
}

/**
 * Filter utility specifically for picking absent records.
 */
export function filterByAbsent(records: readonly Attendance[]): readonly Attendance[] {
  return records.filter((r) => r.status === "ABSENT");
}

/**
 * Filter utility specifically for picking on-leave records.
 */
export function filterByLeave(records: readonly Attendance[]): readonly Attendance[] {
  return records.filter((r) => r.status === "ON_LEAVE");
}

/**
 * Filter utility specifically for picking records with overtime.
 */
export function filterByOvertime(records: readonly Attendance[]): readonly Attendance[] {
  return records.filter((r) => r.overtimeHours !== null && r.overtimeHours > 0);
}

/**
 * Filters records using a custom predicate function.
 */
export function filterByCustomPredicate(
  records: readonly Attendance[],
  predicate: (record: Attendance) => boolean
): readonly Attendance[] {
  return records.filter(predicate);
}

/**
 * Sorts standard Attendance records.
 * Returns a new immutable array.
 *
 * @param records Collection of attendance records
 * @param field Sort field
 * @param order Direction ("asc" | "desc")
 */
export function sortAttendance(
  records: readonly Attendance[],
  field: Exclude<SortField, "employeeName">,
  order: SortOrder = "asc"
): readonly Attendance[] {
  const result = [...records];

  result.sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "date":
        comparison = a.attendanceDate.localeCompare(b.attendanceDate);
        break;
      case "totalHours":
        comparison = (a.totalHours ?? 0) - (b.totalHours ?? 0);
        break;
      case "overtimeHours":
        comparison = (a.overtimeHours ?? 0) - (b.overtimeHours ?? 0);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return result;
}

/**
 * Sorts combined AttendanceWithEmployee records.
 * Returns a new immutable array.
 *
 * @param records Collection of joined attendance records
 * @param field Sort field
 * @param order Direction ("asc" | "desc")
 */
export function sortAttendanceWithEmployee(
  records: readonly AttendanceWithEmployee[],
  field: SortField,
  order: SortOrder = "asc"
): readonly AttendanceWithEmployee[] {
  const result = [...records];

  result.sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "date":
        comparison = a.attendance.attendanceDate.localeCompare(b.attendance.attendanceDate);
        break;
      case "employeeName":
        const nameA = `${a.employee.firstName} ${a.employee.lastName}`.toLowerCase();
        const nameB = `${b.employee.firstName} ${b.employee.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
        break;
      case "totalHours":
        comparison = (a.attendance.totalHours ?? 0) - (b.attendance.totalHours ?? 0);
        break;
      case "overtimeHours":
        comparison = (a.attendance.overtimeHours ?? 0) - (b.attendance.overtimeHours ?? 0);
        break;
      case "status":
        comparison = a.attendance.status.localeCompare(b.attendance.status);
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return result;
}