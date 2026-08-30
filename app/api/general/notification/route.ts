import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generalRateLimit } from "@/lib/rate-limit";

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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (!status) {
      return NextResponse.json(
        {
          status: 400,
          code: "BAD_REQUEST",
          message: "Status wajib disertakan.",
          data: null,
        },
        { status: 400 },
      );
    }

    if (status === "navbar") {
      const unreadNotification = await prisma.notification.findFirst({
        where: {
          reads: {
            none: {
              userId: identifier,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const notifications = {
        hasUnread: !!unreadNotification,
      };

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
    } else if (status === "notification") {
      const notifications = await prisma.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          reads: {
            where: {
              userId: identifier,
            },
            select: {
              id: true,
            },
          },
        },
      });

      if (notifications.length > 0) {
        await prisma.notificationRead.createMany({
          data: notifications.map((notification) => ({
            notificationId: notification.id,
            userId: identifier,
            isRead: true,
          })),
          skipDuplicates: true,
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
    } else {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_STATUS",
          message: "Status notifikasi tidak valid.",
          data: null,
        },
        { status: 400 },
      );
    }
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
