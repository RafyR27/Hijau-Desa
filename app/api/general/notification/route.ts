import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generalRateLimit } from "@/lib/rate-limit";

export async function GET() {
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

    const notifications = await prisma.notification.findMany({
      where: { userId: identifier },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        isRead: true,
        createdAt: true,
      },
    });

    if (notifications.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: {
            in: notifications.map((notification) => notification.id),
          },
        },
        data: {
          isRead: true,
        },
      });
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_NOTIFICATION",
        message: "Berhasil mengambil data notifikasi",
        data: notifications,
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
