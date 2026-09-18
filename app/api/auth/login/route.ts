import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { isRealAuthEnabled } from "@/lib/config/flags";
import { assertProductionRealAuth } from "@/lib/auth/assert-data-management";
import { realLogin } from "@/lib/auth/real-auth";
import {
  SESSION_COOKIE_NAME,
  serializeSession,
  getSessionCookieOptions,
  SESSION_DURATION_MS,
} from "@/lib/auth/session";

const bodySchema = z.object({
  usernameOrEmail: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  // Production must not accept login when real auth is disabled (fail closed).
  // Development may still hit this route with the flag off → 400 below.
  try {
    assertProductionRealAuth();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Application misconfiguration: real authentication is required in production.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }

  if (!isRealAuthEnabled()) {
    return NextResponse.json(
      { success: false, message: "Real authentication is disabled." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials." },
      { status: 400 }
    );
  }

  try {
    const { response, session } = await realLogin(
      parsed.data.usernameOrEmail,
      parsed.data.password
    );

    const sealed = serializeSession(session);
    const cookieOptions = getSessionCookieOptions(
      Math.floor(SESSION_DURATION_MS / 1000)
    );

    // Prefer the App Router cookies() API (Next.js 15+/16).
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sealed, cookieOptions);

    const res = NextResponse.json(response);
    // Also attach on the Response so Set-Cookie is present on the wire.
    res.cookies.set(SESSION_COOKIE_NAME, sealed, cookieOptions);

    console.info(
      `[auth] login ok user=${session.user.email} cookie=${SESSION_COOKIE_NAME} secure=${cookieOptions.secure} path=${cookieOptions.path}`
    );

    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid credentials.";
    return NextResponse.json({ success: false, message }, { status: 401 });
  }
}
