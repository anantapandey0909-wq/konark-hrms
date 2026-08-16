import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  parseSession,
} from "@/lib/auth/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = parseSession(raw ?? null);

    if (!session) {
      return NextResponse.json(
        { success: false, user: null, session: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user,
      session,
    });
  } catch {
    return NextResponse.json(
      { success: false, user: null, session: null },
      { status: 401 }
    );
  }
}
