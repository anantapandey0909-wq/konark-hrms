import { NextResponse } from "next/server";
import { z } from "zod";
import { isRealAuthEnabled } from "@/lib/config/flags";
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
    const res = NextResponse.json(response);
    res.cookies.set(
      SESSION_COOKIE_NAME,
      sealed,
      getSessionCookieOptions(Math.floor(SESSION_DURATION_MS / 1000))
    );
    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid credentials.";
    return NextResponse.json(
      { success: false, message },
      { status: 401 }
    );
  }
}
