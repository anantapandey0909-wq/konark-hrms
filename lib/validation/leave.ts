import { z } from "zod";

export const leaveTypeSchema = z.enum([
  "CASUAL_LEAVE",
  "SICK_LEAVE",
  "EARNED_LEAVE",
  "MATERNITY_LEAVE",
  "PATERNITY_LEAVE",
  "WORK_FROM_HOME",
  "HALF_DAY",
  "COMP_OFF",
]);

export const halfDaySessionSchema = z.enum(["FIRST_HALF", "SECOND_HALF"]);

export const createLeaveSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    leaveType: leaveTypeSchema,
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().trim().min(3).max(500),
    halfDaySession: halfDaySessionSchema.optional().nullable(),
    isHalfDay: z.boolean().optional(),
    attachment: z.string().optional().nullable(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export const updateLeaveSchema = createLeaveSchema.partial().extend({
  employeeId: z.string().min(1).optional(),
});

export const approveRejectSchema = z.object({
  remarks: z.string().max(500).optional().nullable(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
