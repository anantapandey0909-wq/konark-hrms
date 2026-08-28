/**
 * Real authentication implementation (Phase 3).
 * Server-only. Never import from client components.
 */

import { prisma } from "@/lib/prisma";
import type { AuthResponse, AuthSession, AuthUser } from "@/types/auth";
import { hashPassword, verifyPassword, isArgon2Hash } from "@/lib/auth/password";
import { buildSessionForUser } from "@/lib/auth/session";
import {
  generateSecureToken,
  hashToken,
} from "@/lib/auth/session-crypto";
import { toAuthUser, type PrismaUserForAuth } from "@/lib/auth/map-user";

const GENERIC_AUTH_ERROR = "Invalid credentials.";
const MAX_FAILED_ATTEMPTS = 8;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const userAuthInclude = {
  company: true,
  role: true,
  employee: {
    include: { department: true },
  },
} as const;

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

async function findUserForLogin(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  const trimmed = identifier.trim();

  // Single case-insensitive lookup for email or userCode
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: normalized, mode: "insensitive" } },
        { userCode: { equals: trimmed, mode: "insensitive" } },
      ],
    },
    include: userAuthInclude,
  });

  return user;
}

export async function realLogin(
  usernameOrEmail: string,
  password: string
): Promise<{ response: AuthResponse; session: AuthSession }> {
  if (!usernameOrEmail?.trim() || !password) {
    throw new Error(GENERIC_AUTH_ERROR);
  }

  const dbUser = await findUserForLogin(usernameOrEmail);

  if (!dbUser) {
    throw new Error(GENERIC_AUTH_ERROR);
  }

  if (dbUser.accountStatus === "LOCKED") {
    throw new Error("Account is locked. Contact an administrator.");
  }

  if (dbUser.accountStatus !== "ACTIVE") {
    throw new Error(GENERIC_AUTH_ERROR);
  }

  let valid = false;
  if (isArgon2Hash(dbUser.password)) {
    valid = await verifyPassword(password, dbUser.password);
  } else if (process.env.NODE_ENV === "production") {
    // Fail closed: plaintext / legacy hashes are not accepted in production.
    valid = false;
  } else {
    // Development only — upgrade legacy plaintext to Argon2id on successful match.
    valid = dbUser.password === password;
    if (valid) {
      const upgraded = await hashPassword(password);
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { password: upgraded },
      });
    }
  }

  if (!valid) {
    const attempts = dbUser.failedLoginAttempts + 1;
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        failedLoginAttempts: attempts,
        accountStatus:
          attempts >= MAX_FAILED_ATTEMPTS ? "LOCKED" : dbUser.accountStatus,
      },
    });
    throw new Error(GENERIC_AUTH_ERROR);
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      failedLoginAttempts: 0,
      lastLogin: new Date(),
    },
  });

  const authUser = toAuthUser(dbUser as PrismaUserForAuth);
  const session = buildSessionForUser(authUser, { provider: "credentials" });

  return {
    session,
    response: {
      success: true,
      message: "Login successful.",
      user: authUser,
      token: session.token,
      session,
    },
  };
}

/**
 * Request a password reset. Always returns a generic success message.
 * In development, returns the reset token once for local testing.
 */
export async function requestPasswordReset(email: string): Promise<{
  message: string;
  /** Only present when NODE_ENV !== production */
  devResetToken?: string;
  devResetUrl?: string;
}> {
  const generic = {
    message:
      "If an account exists for that email, a reset link has been prepared.",
  };

  const normalized = normalizeIdentifier(email);
  if (!normalized) return generic;

  const user = await prisma.user.findFirst({
    where: { email: { equals: normalized, mode: "insensitive" } },
  });

  if (!user || user.accountStatus === "LOCKED") {
    return generic;
  }

  const rawToken = generateSecureToken(32);
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: tokenHash,
      passwordResetExpiry: expires,
    },
  });

  const baseUrl =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[dev] Password reset prepared (token not logged in production)."
    );
    return {
      ...generic,
      devResetToken: rawToken,
      devResetUrl: resetUrl,
    };
  }

  return generic;
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!token?.trim() || !newPassword) {
    return { success: false, message: "Invalid or expired reset token." };
  }

  const tokenHash = hashToken(token.trim());

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return { success: false, message: "Invalid or expired reset token." };
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpiry: null,
      failedLoginAttempts: 0,
      accountStatus:
        user.accountStatus === "LOCKED" ? "ACTIVE" : user.accountStatus,
    },
  });

  return {
    success: true,
    message: "Password has been reset. You may now sign in.",
  };
}

export type { AuthUser };
