import type { AttendanceRecord, AttendanceFilters, AttendanceStatus } from "@/types/attendance";

/**
 * Filters attendance records for a single employee.
 * Returns the original array if the employeeId is invalid or empty.
 */
export function filterByEmployee(
  records: AttendanceRecord[],
  employeeId?: string
): AttendanceRecord[] {
  if (!employeeId || employeeId.trim() === "") {
    return records;
  }
  return records.filter((record) => record.employeeId === employeeId);
}

/**
 * Filters attendance records by department using a case-insensitive match.
 */
export function filterByDepartment(
  records: AttendanceRecord[],
  department?: string
): AttendanceRecord[] {
  if (!department || department.trim() === "") {
    return records;
  }
  const targetDept = department.trim().toLowerCase();
  return records.filter((record) => record.department.toLowerCase() === targetDept);
}

/**
 * Filters records by their attendance status.
 */
export function filterByStatus(
  records: AttendanceRecord[],
  status?: AttendanceStatus
): AttendanceRecord[] {
  if (!status) {
    return records;
  }
  return records.filter((record) => record.status === status);
}

/**
 * Filters records by location (e.g., Office, Remote) using a case-insensitive match.
 */
export function filterByLocation(
  records: AttendanceRecord[],
  location?: string
): AttendanceRecord[] {
  if (!location || location.trim() === "") {
    return records;
  }
  const targetLoc = location.trim().toLowerCase();
  return records.filter((record) => record.location?.toLowerCase() === targetLoc);
}

/**
 * Filters records by shift name using a case-insensitive match.
 */
export function filterByShift(
  records: AttendanceRecord[],
  shiftName?: string
): AttendanceRecord[] {
  if (!shiftName || shiftName.trim() === "") {
    return records;
  }
  const targetShift = shiftName.trim().toLowerCase();
  return records.filter((record) => record.shiftName?.toLowerCase() === targetShift);
}

/**
 * Filters records matching a single specific date string (YYYY-MM-DD).
 */
export function filterByDate(
  records: AttendanceRecord[],
  date?: string
): AttendanceRecord[] {
  if (!date || date.trim() === "") {
    return records;
  }
  return records.filter((record) => record.date === date);
}

/**
 * Filters records within an inclusive date range (YYYY-MM-DD).
 * Supports partial ranges (start-only or end-only) gracefully.
 */
export function filterByDateRange(
  records: AttendanceRecord[],
  startDate?: string,
  endDate?: string
): AttendanceRecord[] {
  const hasStart = !!startDate && startDate.trim() !== "";
  const hasEnd = !!endDate && endDate.trim() !== "";

  if (!hasStart && !hasEnd) {
    return records;
  }

  return records.filter((record) => {
    // Note: ISO-8601 formatted date strings (YYYY-MM-DD) are lexicographically sortable.
    // Direct string comparison is safe, highly performant, and avoids object instantiation.
    if (hasStart && record.date < startDate) {
      return false;
    }
    if (hasEnd && record.date > endDate) {
      return false;
    }
    return true;
  });
}

/**
 * Performs a case-insensitive search across key employee and organizational fields.
 */
export function searchAttendance(
  records: AttendanceRecord[],
  search?: string
): AttendanceRecord[] {
  if (!search || search.trim() === "") {
    return records;
  }

  const query = search.trim().toLowerCase();

  return records.filter((record) => {
    const searchableFields = [
      record.employeeName,
      record.employeeCode,
      record.department,
    ];

    return searchableFields.some((field) => field.toLowerCase().includes(query));
  });
}

/**
 * Sequentially applies all active filters.
 * Returns a new array reference to preserve immutability.
 */
export function applyAttendanceFilters(
  records: AttendanceRecord[],
  filters: AttendanceFilters
): AttendanceRecord[] {
  let result = [...records];

  result = filterByEmployee(result, filters.employeeId);
  result = filterByDepartment(result, filters.department);
  result = filterByStatus(result, filters.status);
  result = filterByLocation(result, filters.location);
  result = filterByShift(result, filters.shiftName);
  result = filterByDateRange(result, filters.startDate, filters.endDate);

  if (filters.isRegularized !== undefined) {
    result = result.filter((record) => record.isRegularized === filters.isRegularized);
  }

  result = searchAttendance(result, filters.search);

  return result;
}