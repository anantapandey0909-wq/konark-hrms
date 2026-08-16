/**
 * Password hashing & verification (Phase 3).
 * Uses Argon2id — memory-hard, resistant to GPU/ASIC attacks.
 *
 * Configuration chosen for interactive logins on modest server hardware:
 * - memoryCost: 64 MiB
 * - timeCost: 3 iterations
 * - parallelism: 1
 *
 * Never log plaintext passwords or returned hashes to clients.
 */

import argon2 from "argon2";

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 1,
};

/**
 * Hash a plaintext password for storage.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  if (!plaintext || plaintext.length < 8) {
    throw new Error("Password does not meet minimum requirements.");
  }
  return argon2.hash(plaintext, ARGON2_OPTIONS);
}

/**
 * Verify a plaintext password against a stored Argon2 hash.
 * Returns false on any mismatch or malformed hash (fail closed).
 */
export async function verifyPassword(
  plaintext: string,
  storedHash: string
): Promise<boolean> {
  if (!plaintext || !storedHash) return false;
  try {
    return await argon2.verify(storedHash, plaintext);
  } catch {
    return false;
  }
}

/**
 * Detect whether a stored value looks like an Argon2 hash (vs legacy plaintext seed).
 */
export function isArgon2Hash(value: string): boolean {
  return typeof value === "string" && value.startsWith("$argon2");
}
