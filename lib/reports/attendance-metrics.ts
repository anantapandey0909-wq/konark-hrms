import { Attendance } from "@/types/attendance";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AttendanceMetrics {
  readonly totalRecords: number;
  readonly presentCount: number;
  readonly lateCount: number;
  readonly halfDayCount: number;
  readonly absentCount: number;
  readonly onLeaveCount: number;
  readonly averageWorkingHours: number;
  readonly totalOvertimeHours: number;
  readonly regularizationCount: number;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Type guard to check if a numeric transaction field contains a valid database value.
 * Eliminates recurring boilerplate nullish comparisons across calculation steps.
 * 
 * @param value The raw database field value.
 */
function hasNumericValue(value: number | null | undefined): value is number {
  return value !== null && value !== undefined;
}

/**
 * Normalizes floating-point summation to exact display precision.
 * Prevents IEEE 754 float precision issues when rendering user-facing dashboard widgets.
 * 
 * @param value The raw calculated float.
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Computes a standardized average from a total sum and count of active occurrences.
 * Defaults safely to zero if no active records exist.
 * 
 * @param sum The accumulated metric value.
 * @param count The total active occurrences contributing to the sum.
 */
function calculateAverage(sum: number, count: number): number {
  return count > 0 ? roundToTwoDecimals(sum / count) : 0;
}

// ============================================================================
// Primary Calculation Utility
// ============================================================================

/**
 * Calculates standardized, operational metrics for dynamic HR and management dashboard components.
 * 
 * This utility processes raw, tenant-isolated transactional records to produce reliable business indicators.
 * It is structured to run in a single O(n) pass, avoiding nested computations and ensuring high execution performance.
 * 
 * @param records Collection of tenant-isolated attendance records to analyze.
 * @returns Immutable computed operational metrics for reporting.
 */
export function calculateAttendanceMetrics(records: readonly Attendance[]): AttendanceMetrics {
  // Initialization of counters
  let presentCount = 0;
  let lateCount = 0;
  let halfDayCount = 0;
  let absentCount = 0;
  let onLeaveCount = 0;
  let regularizationCount = 0;

  // Initialization of cumulative aggregates
  let totalWorkingHours = 0;
  let totalOvertimeHours = 0;
  let activeWorkDaysCount = 0;

  // Single-pass aggregation loop to maintain strict O(n) runtime complexity
  for (let i = 0; i < records.length; i++) {
    const record = records[i];

    // 1. Status Aggregation
    switch (record.status) {
      case "PRESENT":
        presentCount++;
        break;
      case "LATE":
        lateCount++;
        break;
      case "HALF_DAY":
        halfDayCount++;
        break;
      case "ABSENT":
        absentCount++;
        break;
      case "ON_LEAVE":
        onLeaveCount++;
        break;
    }

    // 2. Compliance and Regularization Tracking
    if (record.isRegularized) {
      regularizationCount++;
    }

    // 3. Numeric Accumulations
    if (hasNumericValue(record.totalHours)) {
      totalWorkingHours += record.totalHours;
      activeWorkDaysCount++;
    }

    if (hasNumericValue(record.overtimeHours)) {
      totalOvertimeHours += record.overtimeHours;
    }

    // Extension Point: Add future custom metric aggregations here
  }

  // Derived Metrics and Formatting
  const averageWorkingHours = calculateAverage(totalWorkingHours, activeWorkDaysCount);
  const roundedOvertimeHours = roundToTwoDecimals(totalOvertimeHours);

  return {
    totalRecords: records.length,
    presentCount,
    lateCount,
    halfDayCount,
    absentCount,
    onLeaveCount,
    averageWorkingHours,
    totalOvertimeHours: roundedOvertimeHours,
    regularizationCount,
  };
}