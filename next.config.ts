import type { NextConfig } from "next";

/**
 * Normalize public data flag at process start so Server Actions and the
 * client bundle agree after `next dev` / `next build` restart.
 */
function resolvePublicRealDataFlag(): string {
  const raw =
    process.env.NEXT_PUBLIC_USE_REAL_DATA ?? process.env.USE_REAL_DATA ?? "false";
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "on"
  ) {
    return "true";
  }
  return "false";
}

const resolvedRealData = resolvePublicRealDataFlag();
// Keep process.env consistent for any server code that reads it later.
process.env.NEXT_PUBLIC_USE_REAL_DATA = resolvedRealData;

const nextConfig: NextConfig = {
  // Native addon — must not be bundled by Turbopack/webpack or verify() fails silently.
  serverExternalPackages: ["argon2"],
  env: {
    NEXT_PUBLIC_USE_REAL_DATA: resolvedRealData,
  },
};

export default nextConfig;
