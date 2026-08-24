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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const productList = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              namaProduct: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
      },
      select: {
        namaProduct: true,
        hargaPoin: true,
      },
      orderBy: { id: "asc" },
    });

    let data: any = {};

    if (role === "warga") {
      const poinWarga = await prisma.poinWarga.findUnique({
        where: { userId: identifier },
      });
      data = {
        saldo: poinWarga ? poinWarga.saldo : 0,
        product: productList,
      };
    } else if (role === "warung") {
      const poinWarung = await prisma.poinWarung.findUnique({
        where: { userId: identifier },
      });
      data = {
        saldo: poinWarung ? poinWarung.saldoPoinTukarWarung : 0,
        product: productList,
      };
    } else if (role === "petugas" || role === "admin") {
      data = {
        product: productList,
      };
    } else {
      data = {
        product: productList,
      };
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_KATALOG",
        message: "Berhasil mengambil data katalog",
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
