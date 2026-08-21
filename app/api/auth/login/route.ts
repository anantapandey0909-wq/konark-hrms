import { NextResponse } from "next/server";
import { z } from "zod";
import { isRealAuthEnabled } from "@/lib/config/flags";
import { realLogin } from "@/lib/auth/real-auth";
import {
  SESSION_COOKIE_NAME,
  serializeSession,
  getSessionCookieOptions,
  shouldUseSecureCookies,
  SESSION_DURATION_MS,
} from "@/lib/auth/session";

const bodySchema = z.object({
  usernameOrEmail: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
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

    // Dev/ops visibility: prove cookie policy without leaking secrets.
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[auth] login ok user=${session.user.email} cookie=${SESSION_COOKIE_NAME} secure=${cookieOptions.secure} sameSite=${cookieOptions.sameSite} path=${cookieOptions.path} sealedBytes=${sealed.length}`
      );
    } else if (shouldUseSecureCookies() === false) {
      // Production binary serving plain HTTP (e.g. local next start) — still log once.
      console.info(
        `[auth] login ok; session cookie Secure=false (APP_URL is http or COOKIE_SECURE=false)`
      );
    }

    const res = NextResponse.json(response);
    res.cookies.set(SESSION_COOKIE_NAME, sealed, cookieOptions);
    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid credentials.";
    return NextResponse.json({ success: false, message }, { status: 401 });
  }
}
