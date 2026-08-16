/**
 * Cryptographic session sealing for HTTP-only cookies.
 * Format: base64url(payload).base64url(hmac-sha256)
 *
 * Uses AUTH_SECRET (min 32 chars). Never expose this secret to the client.
 */

import {
  createHmac,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "crypto";
import type { AuthSession } from "@/types/auth";

function getSecret(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set and at least 32 characters long."
    );
  }
  return Buffer.from(secret, "utf8");
}

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(value: string): Buffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function sign(payloadB64: string): string {
  const mac = createHmac("sha256", getSecret()).update(payloadB64).digest();
  return b64url(mac);
}

/**
 * Seal an AuthSession into a tamper-evident cookie value.
 */
export function sealSession(session: AuthSession): string {
  const payloadB64 = b64url(JSON.stringify(session));
  const signature = sign(payloadB64);
  return `${payloadB64}.${signature}`;
}

/**
 * Unseal and validate a cookie value. Returns null on any failure.
 */
export function unsealSession(
  value: string | undefined | null
): AuthSession | null {
  if (!value || typeof value !== "string") return null;

  const parts = value.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  let expected: string;
  try {
    expected = sign(payloadB64);
  } catch {
    return null;
  }

  try {
    const a = fromB64url(signature);
    const b = fromB64url(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const json = fromB64url(payloadB64).toString("utf8");
    const session = JSON.parse(json) as AuthSession;
    if (!session?.user?.id || !session.token) return null;
    if (
      session.expiresAt &&
      new Date(session.expiresAt).getTime() < Date.now()
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/** Cryptographically secure random token (hex). */
export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

/** SHA-256 hash of a token for safe DB storage. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
