import { z } from "zod";

/**
 * Login form validation schema.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required." })
    .email({ message: "Enter a valid email address." }),

  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters." })
    .max(128, { message: "Password must not exceed 128 characters." }),

  rememberMe: z.boolean(),
});

/**
 * Forgot password form validation schema.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required." })
    .email({ message: "Enter a valid email address." }),
});

/**
 * Reset password form validation schema.
 */
export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, { message: "Security token is required." }),

    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters." })
      .max(128, { message: "Password must not exceed 128 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

/**
 * Login form values.
 */
export type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Forgot password form values.
 */
export type ForgotPasswordSchema = z.infer<
  typeof forgotPasswordSchema
>;

/**
 * Reset password form values.
 */
export type ResetPasswordSchema = z.infer<
  typeof resetPasswordSchema
>;