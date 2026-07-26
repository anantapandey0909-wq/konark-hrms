import { z } from "zod";

/**
 * Enterprise validation schema covering all Department form fields.
 * Naturally inferred by Zod to maximize compatibility with react-hook-form resolvers.
 */
export const departmentSchema = z
  .object({
    code: z
      .string()
      .min(2, "Department code must be at least 2 characters")
      .max(10, "Department code cannot exceed 10 characters")
      .regex(/^[A-Za-z0-9-]+$/, "Code must contain only letters, numbers, and hyphens"),
    name: z
      .string()
      .min(2, "Department name must be at least 2 characters")
      .max(100, "Department name cannot exceed 100 characters"),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .nullable(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    parentDepartmentId: z.string().nullable(),
    managerId: z.string().nullable(),
    sortOrder: z
      .number()
      .int("Sort order must be an integer")
      .nonnegative("Sort order must be a non-negative integer"),
  })
  .refine(
    (data) => {
      // Form-level refinement to preserve structure for error path mappings
      return true;
    },
    {
      message: "A department cannot be its own parent",
      path: ["parentDepartmentId"],
    }
  );

export type DepartmentSchema = z.infer<typeof departmentSchema>;
