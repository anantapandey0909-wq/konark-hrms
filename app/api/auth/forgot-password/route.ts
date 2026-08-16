import { NextResponse } from "next/server";
import { z } from "zod";
import { isRealAuthEnabled } from "@/lib/config/flags";
import { requestPasswordReset } from "@/lib/auth/real-auth";

const bodySchema = z.object({
  email: z.string().trim().email().max(200),
});

export async function POST(request: Request) {
  if (!isRealAuthEnabled()) {
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account exists for that email, a reset link has been prepared.",
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    // Still generic to avoid enumeration via validation differences
    return NextResponse.json({
      success: true,
      message:
        "If an account exists for that email, a reset link has been prepared.",
    });
  }

  const result = await requestPasswordReset(parsed.data.email);

  return NextResponse.json({
    success: true,
    message: result.message,
    ...(result.devResetToken
      ? {
          devResetToken: result.devResetToken,
          devResetUrl: result.devResetUrl,
        }
      : {}),
  });
}
