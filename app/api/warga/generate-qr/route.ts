import {  NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateQRCodeDataURL } from "@/lib/qr";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userRateLimit } from "@/lib/rate-limit";

const QR_EXPIRY_MINUTES = 1;

export async function POST() {
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

    const token = `HD-${randomBytes(16).toString("hex")}`;
    const expiredAt = new Date(Date.now() + QR_EXPIRY_MINUTES * 60 * 1000);

    const qrRecord = await prisma.qrToken.create({
      data: {
        token,
        userId: identifier,
        expiredAt,
      },
    });

    const qrImage = await generateQRCodeDataURL(qrRecord.token);

    return NextResponse.json(
      {
        status: 201,
        code: "SUCCESS_CREATE_QR",
        message: "Berhasil membuat qr",
        data: {
          tokenId: qrRecord.id,
          token: qrRecord.token,
          qrImage,
          expiredAt: qrRecord.expiredAt,
        },
      },
      {
        status: 201,
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
