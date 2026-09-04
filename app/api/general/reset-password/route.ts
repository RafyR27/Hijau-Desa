import { auth } from "@/lib/auth";
import { userRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import * as z from "zod";

const formCompleteProfileSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/[0-9]/)
    .regex(/^(?!.*\s).*$/),
});

export async function POST(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_TOKEN",
          message: "Token tidak valid",
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const rateLimit = await userRateLimit.limit(token);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          status: 429,
          code: "RATE_LIMIT_EXCEEDED",
          message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          data: null,
        },
        {
          status: 429,
        },
      );
    }

    const body = await req.json();
    const validated = formCompleteProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak sesuai",
          errors: validated.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const data = await auth.api.resetPassword({
      body: {
        newPassword: validated.data.password,
        token,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_RESET_PASSWORD",
        message: "Berhasil mereset password",
        data,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server",
        data: null,
      },
      {
        status: 500,
      },
    );
  }
}
