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
 *
 * IMPORTANT: argon2 is a native module. next.config.ts must list it under
 * serverExternalPackages so Next.js does not bundle a broken copy.
 */

import { hash, verify, argon2id, type Options } from "argon2";

const ARGON2_OPTIONS: Options = {
  type: argon2id,
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
  return hash(plaintext, ARGON2_OPTIONS);
}

/**
 * Verify a plaintext password against a stored Argon2 hash.
 * argon2 API order: verify(hash, plain).
 * Returns false on mismatch, malformed hash, or native-module failure (fail closed).
 */
export async function verifyPassword(
  plaintext: string,
  storedHash: string
): Promise<boolean> {
  if (!plaintext || !storedHash) return false;
  try {
    return await verify(storedHash, plaintext);
  } catch {
    return false;
  }
}

/**
 * Detect whether a stored value looks like an Argon2 hash (vs legacy plaintext).
 */
export function isArgon2Hash(value: string): boolean {
  return typeof value === "string" && value.startsWith("$argon2");
}
