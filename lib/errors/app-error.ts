/**
 * Safe application errors — never expose Prisma/DB internals to the client.
 */

import { ZodError } from "zod";

export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "TENANT"
  | "INTERNAL";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor(code: AppErrorCode, message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toSafeActionResult(error: unknown): {
  success: false;
  error: string;
  code: AppErrorCode;
} {
  if (isAppError(error)) {
    return { success: false, error: error.message, code: error.code };
  }

  if (error instanceof ZodError) {
    const first = error.issues[0];
    const message = first?.message ?? "Validation failed.";
    return { success: false, error: message, code: "VALIDATION" };
  }

  // UnauthenticatedError / TenantIsolationError by name
  if (error instanceof Error) {
    if (error.name === "UnauthenticatedError") {
      return {
        success: false,
        error: "Authentication required.",
        code: "UNAUTHORIZED",
      };
    }
    if (error.name === "TenantIsolationError") {
      return {
        success: false,
        error: "You do not have access to this resource.",
        code: "TENANT",
      };
    }
  }

  console.error("[action]", error);
  return {
    success: false,
    error: "Something went wrong. Please try again.",
    code: "INTERNAL",
  };
}
