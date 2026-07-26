// ============================================================================
// Imports
// ============================================================================

import { Attendance, AttendanceWithEmployee } from "@/types/attendance";
import { mockEmployees } from "@/mock/employee";

// ============================================================================
// Constants
// ============================================================================

/**
 * Reusable system constants to prevent literal duplication, enforce type safety,
 * and facilitate future localization or structural changes in the system metadata.
 */
const TENANT_KONARK = "tenant-konark-tech";
const TENANT_SHAKTI = "tenant-shakti-auto";
const TENANT_AYURCARE = "tenant-ayurcare";

const LOC_BANGALORE = "Bangalore Office";
const LOC_PUNE = "Pune Plant";
const LOC_KOCHI = "Kochi Clinic";

const SHIFT_GENERAL = "General Shift";
const SHIFT_MORNING = "Morning Shift";

const WORK_MODE_OFFICE = "OFFICE";

const STATUS_PRESENT = "PRESENT";
const STATUS_LATE = "LATE";
const STATUS_ON_LEAVE = "ON_LEAVE";

// ============================================================================
// Attendance Records
// ============================================================================

/**
 * Normalized representation of attendance events.
 * 
 * This array acts as the raw database table equivalent. By keeping it normalized
 * and referencing only the `employeeId` and `tenantId`, we prevent data duplication
 * and eliminate synchronization anomalies. Each record is scoped strictly to a tenant,
 * enforcing secure data isolation within our multi-tenant SaaS architecture.
 */
export const mockAttendances: Attendance[] = [
  {
    id: "att-101",
    tenantId: TENANT_KONARK,
    employeeId: "emp-101",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T09:02:14.000Z",
    checkOut: "2025-01-15T18:15:30.000Z",
    totalHours: 9.22,
    overtimeHours: 1.22,
    breakDuration: 45,
    status: STATUS_PRESENT,
    workMode: WORK_MODE_OFFICE,
    location: LOC_BANGALORE,
    shiftName: SHIFT_GENERAL,
    isRegularized: false,
    remarks: "Standard operations.",
    createdAt: "2025-01-15T18:15:30.000Z",
    updatedAt: "2025-01-15T18:15:30.000Z",
  },
  {
    id: "att-102",
    tenantId: TENANT_KONARK,
    employeeId: "emp-102",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T09:15:00.000Z",
    checkOut: "2025-01-15T18:00:00.000Z",
    totalHours: 8.75,
    overtimeHours: 0.75,
    breakDuration: 60,
    status: STATUS_PRESENT,
    workMode: WORK_MODE_OFFICE,
    location: LOC_BANGALORE,
    shiftName: SHIFT_GENERAL,
    isRegularized: false,
    remarks: "Regular logged shift.",
    createdAt: "2025-01-15T18:00:00.000Z",
    updatedAt: "2025-01-15T18:00:00.000Z",
  },
  {
    id: "att-103",
    tenantId: TENANT_KONARK,
    employeeId: "emp-103",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T08:55:00.000Z",
    checkOut: "2025-01-15T17:45:00.000Z",
    totalHours: 8.83,
    overtimeHours: 0.83,
    breakDuration: 45,
    status: STATUS_PRESENT,
    workMode: WORK_MODE_OFFICE,
    location: LOC_BANGALORE,
    shiftName: SHIFT_GENERAL,
    isRegularized: false,
    remarks: "Shift completed on time.",
    createdAt: "2025-01-15T17:45:00.000Z",
    updatedAt: "2025-01-15T17:45:00.000Z",
  },
  {
    id: "att-104",
    tenantId: TENANT_KONARK,
    employeeId: "emp-104",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T09:35:00.000Z",
    checkOut: "2025-01-15T18:30:00.000Z",
    totalHours: 8.92,
    overtimeHours: 0.92,
    breakDuration: 45,
    status: STATUS_LATE,
    workMode: WORK_MODE_OFFICE,
    location: LOC_BANGALORE,
    shiftName: SHIFT_GENERAL,
    isRegularized: true,
    remarks: "Slightly delayed check-in.",
    createdAt: "2025-01-15T18:30:00.000Z",
    updatedAt: "2025-01-15T18:30:00.000Z",
  },
  {
    id: "att-105",
    tenantId: TENANT_KONARK,
    employeeId: "emp-105",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T09:00:00.000Z",
    checkOut: "2025-01-15T18:00:00.000Z",
    totalHours: 9.0,
    overtimeHours: 1.0,
    breakDuration: 60,
    status: STATUS_PRESENT,
    workMode: WORK_MODE_OFFICE,
    location: LOC_BANGALORE,
    shiftName: SHIFT_GENERAL,
    isRegularized: false,
    remarks: "Standard operations.",
    createdAt: "2025-01-15T18:00:00.000Z",
    updatedAt: "2025-01-15T18:00:00.000Z",
  },
  {
    id: "att-106",
    tenantId: TENANT_KONARK,
    employeeId: "emp-106",
    attendanceDate: "2025-01-15",
    checkIn: null,
    checkOut: null,
    totalHours: null,
    overtimeHours: null,
    breakDuration: null,
    status: STATUS_ON_LEAVE,
    workMode: WORK_MODE_OFFICE,
    location: null,
    shiftName: null,
    isRegularized: false,
    remarks: "On approved medical leave.",
    createdAt: "2025-01-15T09:00:00.000Z",
    updatedAt: "2025-01-15T09:00:00.000Z",
  },
  {
    id: "att-107",
    tenantId: TENANT_SHAKTI,
    employeeId: "emp-109",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T09:01:00.000Z",
    checkOut: "2025-01-15T18:05:00.000Z",
    totalHours: 9.06,
    overtimeHours: 1.06,
    breakDuration: 60,
    status: STATUS_PRESENT,
    workMode: WORK_MODE_OFFICE,
    location: LOC_PUNE,
    shiftName: SHIFT_MORNING,
    isRegularized: false,
    remarks: "Standard factory shift.",
    createdAt: "2025-01-15T18:05:00.000Z",
    updatedAt: "2025-01-15T18:05:00.000Z",
  },
  {
    id: "att-108",
    tenantId: TENANT_AYURCARE,
    employeeId: "emp-108",
    attendanceDate: "2025-01-15",
    checkIn: "2025-01-15T09:10:00.000Z",
    checkOut: "2025-01-15T18:10:00.000Z",
    totalHours: 9.0,
    overtimeHours: 1.0,
    breakDuration: 45,
    status: STATUS_PRESENT,
    workMode: WORK_MODE_OFFICE,
    location: LOC_KOCHI,
    shiftName: SHIFT_GENERAL,
    isRegularized: false,
    remarks: "Standard accounting audit day.",
    createdAt: "2025-01-15T18:10:00.000Z",
    updatedAt: "2025-01-15T18:10:00.000Z",
  }
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Compiles a performant lookup index map of all available employees.
 * This structure avoids the costly nested lookup overhead of Array.prototype.find
 * and keeps the resolution logic operating at O(n) overall time complexity.
 */
const employeeMap = new Map<string, typeof mockEmployees[number]>(
  mockEmployees.map((employee) => [employee.id, employee])
);

/**
 * Resolves the employee details corresponding to an attendance record.
 * 
 * Mimics relational foreign key checks on relational transactional databases.
 * In addition to resolving the object reference, this enforces isolation rules 
 * by throwing a runtime validation exception if a cross-tenant leak is detected.
 *
 * @param attendance The source attendance transaction record.
 * @param map Precompiled index map containing available employee models.
 * @returns The validated employee object.
 * @throws {Error} If the relationship is missing or tenant boundaries are violated.
 */
function resolveEmployee(
  attendance: Attendance,
  map: Map<string, typeof mockEmployees[number]>
): typeof mockEmployees[number] {
  const employee = map.get(attendance.employeeId);

  if (!employee) {
    throw new Error(
      `Attendance ${attendance.id} references missing employee ${attendance.employeeId}`
    );
  }

  if (employee.tenantId !== attendance.tenantId) {
    throw new Error(
      `Tenant integrity violation: Attendance ${attendance.id} for tenant ${attendance.tenantId} references employee ${employee.id} belonging to tenant ${employee.tenantId}`
    );
  }

  return employee;
}

// ============================================================================
// Exports & Dynamic Resolving
// ============================================================================

/**
 * Dynamically resolves and denormalizes the relational metadata of each attendance event.
 * 
 * This implementation mimics an active ORM join query (e.g., Prisma "include") to
 * serve rich transactional records directly to tabular frontends. Relational integrity
 * checks are enforced, avoiding silent fallback defaults and ensuring correctness in local development.
 */
export const mockAttendanceWithEmployees: AttendanceWithEmployee[] = mockAttendances.map((attendance) => {
  const employee = resolveEmployee(attendance, employeeMap);

  return {
    id: attendance.id,
    attendance,
    employee: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      avatarUrl: employee.avatarUrl ?? null,
      designation: employee.designation,
      departmentId: employee.departmentId ?? null,
    },
  };
});