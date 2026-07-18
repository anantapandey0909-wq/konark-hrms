import { z } from "zod";

import {
  DEPARTMENT_STATUS_VALUES,
  type DepartmentFormData,
} from "@/types/department";

/* -------------------------------------------------------------------------- */
/*                               Field Schemas                                */
/* -------------------------------------------------------------------------- */

export const departmentCodeSchema = z
  .string()
  .trim()
  .min(2, "Department code must be at least 2 characters.")
  .max(20, "Department code cannot exceed 20 characters.")
  .regex(
    /^[A-Z0-9_-]+$/,
    "Department code may contain only uppercase letters, numbers, hyphens, and underscores."
  );

export const departmentNameSchema = z
  .string()
  .trim()
  .min(2, "Department name must be at least 2 characters.")
  .max(100, "Department name cannot exceed 100 characters.");

export const departmentDescriptionSchema = z
  .string()
  .trim()
  .max(500, "Description cannot exceed 500 characters.");

export const departmentStatusSchema = z.enum(DEPARTMENT_STATUS_VALUES);

export const departmentEmployeeSchema = z
  .string()
  .trim()
  .nullable();

export const parentDepartmentSchema = z
  .string()
  .trim()
  .nullable();

export const departmentBudgetSchema = z
  .number({
    error: "Allocated budget is required.",
  })
  .min(0, "Allocated budget cannot be negative.");

/* -------------------------------------------------------------------------- */
/*                             Department Schema                              */
/* -------------------------------------------------------------------------- */

export const departmentSchema = z
  .object({
    code: departmentCodeSchema,
    name: departmentNameSchema,
    description: departmentDescriptionSchema,
    status: departmentStatusSchema,
    parentDepartmentId: parentDepartmentSchema,
    headEmployeeId: departmentEmployeeSchema,
    managerEmployeeId: departmentEmployeeSchema,
    allocatedBudget: departmentBudgetSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.parentDepartmentId &&
      data.parentDepartmentId === data.code
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parentDepartmentId"],
        message: "A department cannot be its own parent.",
      });
    }

    if (
      data.headEmployeeId &&
      data.managerEmployeeId &&
      data.headEmployeeId === data.managerEmployeeId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["managerEmployeeId"],
        message:
          "Department Head and Department Manager must be different employees.",
      });
    }
  });

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

export type DepartmentSchema = z.infer<typeof departmentSchema>;

export type DepartmentFormValues = DepartmentFormData;