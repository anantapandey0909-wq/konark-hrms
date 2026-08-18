import { z } from "zod";

export const attendanceStatusSchema = z.enum([
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "ON_LEAVE",
]);

export const workModeSchema = z.enum(["OFFICE", "REMOTE", "HYBRID"]);

export const createAttendanceSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  attendanceDate: z.string().min(1, "Attendance date is required"),
  checkIn: z.string().nullable().optional(),
  checkOut: z.string().nullable().optional(),
  totalHours: z.number().nullable().optional(),
  overtimeHours: z.number().nullable().optional(),
  breakDuration: z.number().int().nullable().optional(),
  status: attendanceStatusSchema,
  workMode: workModeSchema,
  remarks: z.string().max(500).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  shiftName: z.string().max(100).nullable().optional(),
  isRegularized: z.boolean().optional(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial().extend({
  employeeId: z.string().min(1).optional(),
  attendanceDate: z.string().min(1).optional(),
  status: attendanceStatusSchema.optional(),
  workMode: workModeSchema.optional(),
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
