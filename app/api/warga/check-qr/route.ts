// Query Parameter:
// ?token=string (Token QR)
//
// ex URL: /api/check-qr?token=abc-123-xyz

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
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
    const rateLimit = await userRateLimit.limit(identifier);

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

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          status: 400,
          code: "TOKEN_REQUIRED",
          message: "Query parameter 'token' wajib disertakan",
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    const tokenRecord = await prisma.qrToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            noRumah: true,
          },
        },
      },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        {
          status: 404,
          code: "TOKEN_NOT_FOUND",
          message: "Token QR tidak valid atau tidak terdaftar",
          data: null,
        },
        { status: 404 },
      );
    }

    const now = new Date();
    const isExpired = now > tokenRecord.expiredAt;

    if (isExpired) {
      return NextResponse.json(
        {
          status: 400,
          code: "TOKEN_EXPIRED",
          message: "Token QR sudah expired",
          data: null,
        },
        { status: 400 },
      );
    }


    if (tokenRecord.isUsed) {
      return NextResponse.json(
        {
          status: 400,
          code: "TOKEN_ALREADY_USED",
          message: "Token QR sudah digunakan",
          data: null,
        },
        { status: 400 },
      );
    }

    const tokenUpdate = await prisma.qrToken.update({
      where: { token },
      data: {
        isUsed: true,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_VERIF_TOKEN",
        message: "Token berhasil diverifikasi",
        data: {
          isUsed: tokenUpdate.isUsed,
          user: tokenRecord.user,
        },
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
      {
        status: 500,
      },
    );
  }
}
