import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
} from "@/lib/auth/session";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out.",
  });

  // Match login cookie attributes so the browser clears the same cookie.
  const base = getSessionCookieOptions(0);
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    ...base,
    maxAge: 0,
  });

  return res;
}
