import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const formCompleteProfileSchema = z.object({
  noHP: z
    .string()
    .trim()
    .min(1)
    .regex(/^08\d{8,12}$/),

  noRumah: z.string().trim().min(1).max(20),
});

export async function PATCH(req: Request) {
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
        {
          status: 401,
        },
      );
    }

    const identifier = session.user.id;
    const rateLimit = await generalRateLimit.limit(identifier);

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

    const existingUser = await prisma.user.findFirst({
      where: {
        noHP: validated.data.noHP,
        NOT: {
          id: identifier,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          status: 409,
          code: "PHONE_ALREADY_EXISTS",
          message: "Nomor HP sudah terdaftar",
          data: null,
        },
        {
          status: 409,
        },
      );
    }

    const result = await prisma.user.update({
      where: {
        id: identifier,
      },
      data: {
        noHP: validated.data.noHP,
        noRumah: validated.data.noRumah,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_PROFILE",
        message: "Berhasil memperbarui profile",
        data: result,
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
