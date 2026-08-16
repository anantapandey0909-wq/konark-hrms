import { NextResponse } from "next/server";
import { z } from "zod";
import { isRealAuthEnabled } from "@/lib/config/flags";
import { resetPasswordWithToken } from "@/lib/auth/real-auth";

const bodySchema = z.object({
  token: z.string().trim().min(1),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
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
      { success: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Password does not meet requirements or token is invalid.",
      },
      { status: 400 }
    );
  }

  const result = await resetPasswordWithToken(
    parsed.data.token,
    parsed.data.password
  );

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
