import type { AttendanceRecord, AttendanceStats } from "@/types/attendance";
import { mockEmployees } from "@/mock/employee";

/**
 * Resolves employee information directly from mockEmployees.
 * Throws a descriptive error during development if referential integrity is violated.
 */
const getEmployeeData = (id: string) => {
  const employee = mockEmployees.find((emp) => emp.id === id);

  if (!employee) {
    throw new Error(
      `Referential Integrity Violation: Employee with ID "${id}" was not found in mockEmployees. Please check mock/attendance.ts.`
    );
  }

  return {
    employeeId: employee.id,
    employeeCode: employee.employeeCode,
    employeeName: employee.fullName,
    department: employee.department,
  };
};

export const mockAttendanceRecords: AttendanceRecord[] = [
  // ==========================================
  // ATTENDANCE LOGS: 2025-02-17
  // ==========================================
  {
    id: "ATT-001",
    ...getEmployeeData("emp-101"),
    date: "2025-02-17",
    clockInAt: "2025-02-17T09:00:00Z",
    clockOutAt: "2025-02-17T18:00:00Z",
    status: "PRESENT",
    workHours: 8,
    overtimeHours: 0,
    location: "Office",
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Regular check-in",
  },
  {
    id: "ATT-002",
    ...getEmployeeData("emp-102"),
    date: "2025-02-17",
    clockInAt: "2025-02-17T09:45:00Z",
    clockOutAt: "2025-02-17T18:15:00Z",
    status: "LATE",
    workHours: 7.5,
    overtimeHours: 0,
    location: "Remote",
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Delayed due to traffic transit issues",
  },
  {
    id: "ATT-003",
    ...getEmployeeData("emp-103"), // Elena Rostova (Active Maternity Leave LV-1009)
    date: "2025-02-17",
    clockInAt: null,
    clockOutAt: null,
    status: "ON_LEAVE",
    workHours: null,
    overtimeHours: null,
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Approved Maternity Leave",
  },
  {
    id: "ATT-004",
    ...getEmployeeData("emp-106"), // Liam O'Connor (Active Sick Leave LV-1002, Status: ON_LEAVE)
    date: "2025-02-17",
    clockInAt: null,
    clockOutAt: null,
    status: "ON_LEAVE",
    workHours: null,
    overtimeHours: null,
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Approved Sick Leave - Recovery from procedure",
  },
  {
    id: "ATT-005",
    ...getEmployeeData("emp-108"), // Sofia Al-Farsi (Active Casual Leave LV-1003)
    date: "2025-02-17",
    clockInAt: null,
    clockOutAt: null,
    status: "ON_LEAVE",
    workHours: null,
    overtimeHours: null,
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Approved Casual Leave - Attending family event",
  },
  {
    id: "ATT-006",
    ...getEmployeeData("emp-105"),
    date: "2025-02-17",
    clockInAt: "2025-02-17T08:50:00Z",
    clockOutAt: "2025-02-17T17:50:00Z",
    status: "PRESENT",
    workHours: 8,
    overtimeHours: 0,
    location: "Office",
    shiftName: "General Shift",
    isRegularized: false,
  },
  {
    id: "ATT-007",
    ...getEmployeeData("emp-110"),
    date: "2025-02-17",
    clockInAt: "2025-02-17T08:55:00Z",
    clockOutAt: "2025-02-17T19:30:00Z",
    status: "PRESENT",
    workHours: 8.5,
    overtimeHours: 1.5,
    location: "Office",
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Assisted with critical end-of-day handovers",
  },
  {
    id: "ATT-008",
    ...getEmployeeData("emp-121"), // Chloe Dupont (Intern, Inactive status simulation)
    date: "2025-02-17",
    clockInAt: null,
    clockOutAt: null,
    status: "ABSENT",
    workHours: null,
    overtimeHours: null,
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Unexcused absence - No call show",
  },

  // ==========================================
  // ATTENDANCE LOGS: 2025-02-16
  // ==========================================
  {
    id: "ATT-009",
    ...getEmployeeData("emp-101"),
    date: "2025-02-16",
    clockInAt: "2025-02-16T08:50:00Z",
    clockOutAt: "2025-02-16T17:50:00Z",
    status: "PRESENT",
    workHours: 8,
    overtimeHours: 0,
    location: "Office",
    shiftName: "General Shift",
    isRegularized: false,
  },
  {
    id: "ATT-010",
    ...getEmployeeData("emp-102"),
    date: "2025-02-16",
    clockInAt: "2025-02-16T13:00:00Z",
    clockOutAt: "2025-02-16T17:00:00Z",
    status: "HALF_DAY",
    workHours: 4,
    overtimeHours: 0,
    location: "Remote",
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Routine medical consultation in the morning",
  },
  {
    id: "ATT-011",
    ...getEmployeeData("emp-103"), // Elena Rostova (Active Maternity Leave LV-1009)
    date: "2025-02-16",
    clockInAt: null,
    clockOutAt: null,
    status: "ON_LEAVE",
    workHours: null,
    overtimeHours: null,
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Approved Maternity Leave",
  },
  {
    id: "ATT-012",
    ...getEmployeeData("emp-106"), // Liam O'Connor (Active Sick Leave LV-1002)
    date: "2025-02-16",
    clockInAt: null,
    clockOutAt: null,
    status: "ON_LEAVE",
    workHours: null,
    overtimeHours: null,
    shiftName: "General Shift",
    isRegularized: false,
    notes: "Approved Sick Leave - Recovery from procedure",
  },
  {
    id: "ATT-013",
    ...getEmployeeData("emp-115"),
    date: "2025-02-16",
    clockInAt: "2025-02-16T08:45:00Z",
    clockOutAt: "2025-02-16T18:00:00Z",
    status: "PRESENT",
    workHours: 8.25,
    overtimeHours: 0.25,
    location: "Office",
    shiftName: "General Shift",
    isRegularized: false,
  },
];

/**
 * NOTE: mockAttendanceStats represents aggregated, organization-wide summary data
 * (e.g., across all active/inactive employees over a broader, cumulative date range)
 * rather than being dynamically derived from the sample records listed above.
 * This preserves high-fidelity KPI values on the dashboard analytics views.
 */
export const mockAttendanceStats: AttendanceStats = {
  presentCount: 220,
  absentCount: 3,
  lateCount: 15,
  onLeaveCount: 12,
  attendanceRate: 94.5,
  averageWorkHours: 8.1,
  totalOvertimeHours: 45.5,
};