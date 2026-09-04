import { auth } from "@/lib/auth";
import { userRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
      .regex(/^(?!.*\s).*$/, "Password tidak boleh mengandung spasi"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          status: 401,
          code: "UNAUTHORIZED",
          message: "Sesi Anda telah berakhir",
          data: null,
        },
        { status: 401 }
      );
    }

    const identifier = session.user.id;
    const rateLimit = await userRateLimit.limit(identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          status: 429,
          code: "RATE_LIMIT_EXCEEDED",
          message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          data: null,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = setPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak valid",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await auth.api.setPassword({
      body: {
        newPassword: validated.data.password,
      },
      headers: await headers(),
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_SET_PASSWORD",
        message: "Password berhasil dibuat dan disimpan",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/general/set-password error:", error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server",
        data: null,
      },
      { status: 500 }
    );
  }
}
