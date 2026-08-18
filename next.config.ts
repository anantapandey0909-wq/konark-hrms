import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native addon — must not be bundled by Turbopack/webpack or verify() fails silently.
  serverExternalPackages: ["argon2"],
};

export default nextConfig;
