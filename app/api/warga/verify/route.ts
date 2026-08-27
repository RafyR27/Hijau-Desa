import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limit";
import { ProfileData } from "@/types/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
        { status: 401 },
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
        { status: 429 },
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("idUser");
    const token = searchParams.get("token");

    if (!userId || !token) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_REQUEST",
          message: "idUser dan token wajib diisi",
          data: null,
        },
        { status: 400 },
      );
    }

    const existToken = await prisma.qrToken.findUnique({
      where: { token, isUsed: false },
    });

    if (!existToken) {
      return NextResponse.json(
        {
          status: 404,
          code: "TOKEN_NOT_FOUND",
          message: "Token tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        noRumah: true,
        noHP: true,
        image: true,
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
        { status: 404 },
      );
    }

    const data: ProfileData = {
      user: {
        name: user.name,
        email: user.email,
        noRumah: user.noRumah,
        noHP: user.noHP,
        image: user.image,
        createdAt: user.createdAt,
      },
    };

    const poinWarga = await prisma.poinWarga.findUnique({
      where: { userId: userId },
    });

    data.poin = {
      saldo: poinWarga?.saldo ?? 0,
    };

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_PROFILE",
        message: "Berhasil mengambil data profile",
        data,
      },
      { status: 200 },
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
      { status: 500 },
    );
  }
}
