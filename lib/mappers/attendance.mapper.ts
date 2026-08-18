import type {
  Attendance,
  AttendanceWithEmployee,
  AttendanceStatus,
  WorkMode,
} from "@/types/attendance";
import type {
  AttendanceStatus as PrismaAttendanceStatus,
  WorkMode as PrismaWorkMode,
} from "@prisma/client";

export type PrismaAttendanceRow = {
  id: string;
  companyId: string;
  employeeId: string;
  attendanceDate: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  totalHours: number | null;
  overtimeHours: number | null;
  breakDuration: number | null;
  status: PrismaAttendanceStatus;
  workMode: PrismaWorkMode;
  location: string | null;
  shiftName: string | null;
  isRegularized: boolean;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    designation: string;
    departmentId: string;
  } | null;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function mapAttendanceToFrontend(row: PrismaAttendanceRow): Attendance {
  return {
    id: row.id,
    tenantId: row.companyId,
    employeeId: row.employeeId,
    attendanceDate: isoDate(row.attendanceDate),
    checkIn: row.checkIn ? row.checkIn.toISOString() : null,
    checkOut: row.checkOut ? row.checkOut.toISOString() : null,
    totalHours: row.totalHours,
    overtimeHours: row.overtimeHours,
    breakDuration: row.breakDuration,
    status: row.status as AttendanceStatus,
    workMode: row.workMode as WorkMode,
    remarks: row.remarks,
    location: row.location,
    shiftName: row.shiftName,
    isRegularized: row.isRegularized,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapAttendanceWithEmployee(
  row: PrismaAttendanceRow
): AttendanceWithEmployee {
  const attendance = mapAttendanceToFrontend(row);
  const emp = row.employee;
  return {
    id: row.id,
    attendance,
    employee: {
      firstName: emp?.firstName ?? "Unknown",
      lastName: emp?.lastName ?? "",
      email: emp?.email ?? "",
      avatarUrl: emp?.profileImage ?? null,
      designation: emp?.designation ?? "",
      departmentId: emp?.departmentId ?? null,
    },
  };
}

/** Standard day = 8 hours; overtime = max(0, total - 8). */
export function computeHours(
  checkIn: Date | null,
  checkOut: Date | null,
  breakMinutes: number | null
): { totalHours: number | null; overtimeHours: number | null } {
  if (!checkIn || !checkOut) {
    return { totalHours: null, overtimeHours: null };
  }
  const ms = checkOut.getTime() - checkIn.getTime();
  if (ms <= 0) return { totalHours: null, overtimeHours: null };
  const breakH = (breakMinutes ?? 0) / 60;
  const total = Math.round((ms / 3_600_000 - breakH) * 100) / 100;
  const overtime = Math.round(Math.max(0, total - 8) * 100) / 100;
  return { totalHours: total, overtimeHours: overtime };
}
