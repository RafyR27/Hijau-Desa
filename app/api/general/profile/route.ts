import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          status: 401,
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const identifier = session.user.id;
    const role = session.user.role;
    const rateLimit = await generalRateLimit.limit(identifier);

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

    const user = await prisma.user.findUnique({
      where: { id: identifier },
      select: {
        name: true,
        email: true,
        noRumah: true,
        noHP: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: 404,
          code: "USER_NOT_FOUND",
          message: "User tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }

    let data: any = {
      user: {
        name: user.name,
        email: user.email,
        noRumah: user.noRumah,
        noHP: user.noHP,
        createdAt: user.createdAt,
      },
    };

    if (role === "warga") {
      const poinWarga = await prisma.poinWarga.findUnique({
        where: { userId: identifier },
      });
      data.poinWarga = {
        saldo: poinWarga ? poinWarga.saldo : 0,
      };
    } else if (role === "warung") {
      const poinWarung = await prisma.poinWarung.findUnique({
        where: { userId: identifier },
      });
      data.poinWarung = {
        saldoPoinTukarWarung: poinWarung ? poinWarung.saldoPoinTukarWarung : 0,
        saldoRupiah: poinWarung ? poinWarung.saldoRupiah : 0,
      };
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_PROFILE",
        message: "Berhasil mengambil data profile",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      },
      { status: 500 }
    );
  }
}
