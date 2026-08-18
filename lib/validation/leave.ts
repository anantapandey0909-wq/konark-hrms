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

/**
 * Base field definitions only (no refinements).
 * `.partial()` must be applied to this object schema, not to a refined schema.
 */
const leaveRequestBaseSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  leaveType: leaveTypeSchema,
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().trim().min(3).max(500),
  halfDaySession: halfDaySessionSchema.optional().nullable(),
  isHalfDay: z.boolean().optional(),
  attachment: z.string().optional().nullable(),
});

function withDateOrderRefine<
  T extends z.ZodTypeAny
>(schema: T) {
  return schema.refine(
    (d) => {
      const data = d as {
        startDate?: string;
        endDate?: string;
      };
      // Skip cross-field check when either date is omitted (partial updates).
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );
}

/** Create: all required fields + date-order refinement. */
export const createLeaveSchema = withDateOrderRefine(leaveRequestBaseSchema);

/** Update/patch: partial fields + same date-order refinement when both dates present. */
export const updateLeaveSchema = withDateOrderRefine(
  leaveRequestBaseSchema.partial()
);

export const approveRejectSchema = z.object({
  remarks: z.string().max(500).optional().nullable(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
