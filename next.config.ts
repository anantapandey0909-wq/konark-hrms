import type { NextConfig } from "next";

function resolvePublicFlag(
  publicName: string,
  serverAlias?: string
): string {
  const raw =
    process.env[publicName] ??
    (serverAlias ? process.env[serverAlias] : undefined) ??
    "false";
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

const resolvedRealData = resolvePublicFlag(
  "NEXT_PUBLIC_USE_REAL_DATA",
  "USE_REAL_DATA"
);
const resolvedRealAuth = resolvePublicFlag(
  "NEXT_PUBLIC_USE_REAL_AUTH",
  "USE_REAL_AUTH"
);

process.env.NEXT_PUBLIC_USE_REAL_DATA = resolvedRealData;
process.env.NEXT_PUBLIC_USE_REAL_AUTH = resolvedRealAuth;

const nextConfig: NextConfig = {
  // Native addon — must not be bundled by Turbopack/webpack or verify() fails silently.
  serverExternalPackages: ["argon2"],
  env: {
    NEXT_PUBLIC_USE_REAL_DATA: resolvedRealData,
    NEXT_PUBLIC_USE_REAL_AUTH: resolvedRealAuth,
  },
};

export default nextConfig;
