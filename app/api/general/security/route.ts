import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { userRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

    const accounts = await prisma.account.findMany({
      where: {
        userId: identifier,
      },
      select: {
        id: true,
        providerId: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const credentialAccount = accounts.find(
      (acc) => acc.providerId === "credential"
    );

    const hasPassword = Boolean(
      credentialAccount && credentialAccount.password
    );

    const loginMethods = Array.from(
      new Set(accounts.map((acc) => acc.providerId))
    );

    const passwordUpdatedAt =
      hasPassword && credentialAccount ? credentialAccount.updatedAt : null;

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_SECURITY_INFO",
        message: "Berhasil mendapatkan informasi keamanan",
        data: {
          loginMethods,
          hasPassword,
          passwordUpdatedAt,
          email: session.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/general/security error:", error);
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
