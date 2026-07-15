import { mockAttendanceStats } from '@/mock/attendance';
import type { AttendanceMetrics } from '@/types/report-metrics';

/**
 * Adapts organization-level attendance KPIs from the Attendance module for the
 * Reports module. This utility directly maps precalculated metrics from mockAttendanceStats
 * to avoid resource-intensive recalculations of raw daily attendance transactions.
 * 
 * @returns {AttendanceMetrics} Mapped organization-level attendance metrics.
 */
export function getAttendanceMetrics(): AttendanceMetrics {
  return {
    presentCount: mockAttendanceStats.presentCount,
    absentCount: mockAttendanceStats.absentCount,
    lateCount: mockAttendanceStats.lateCount,
    onLeaveCount: mockAttendanceStats.onLeaveCount,
    attendanceRate: mockAttendanceStats.attendanceRate,
    averageWorkHours: mockAttendanceStats.averageWorkHours,
    totalOvertimeHours: mockAttendanceStats.totalOvertimeHours,
  };
}