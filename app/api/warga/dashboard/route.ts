import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limit";
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
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const identifier = session.user.id;
    const role = session.user.role;

    
    if(role !== "warga"){
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDDEN",
          message: "Anda tidak memiliki akses ke fitur ini.",
          data: null,
        },
        { status: 403 },
      );
    }

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

    let data = {};

    const poinWarga = await prisma.poinWarga.findUnique({
      where: { userId: identifier },
    });

    const setorList = await prisma.transaksiSetor.findMany({
      where: { wargaId: identifier },
      include: {
        kategori: { select: { namaKategori: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const tukarList = await prisma.transaksiTukar.findMany({
      where: { wargaId: identifier },
      include: {
        product: { select: { namaProduct: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const transaksi = [
      ...setorList.map((item) => ({
        id: item.id,
        type: "masuk" as const,
        title: `Setor ${item.kategori.namaKategori}`,
        createdAt: item.createdAt,

        dateKey: item.createdAt.toLocaleDateString("en-CA", {
          timeZone: "Asia/Jakarta",
        }),

        monthYear: item.createdAt.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),

        dateLabel: item.createdAt.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),

        time: `${item.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })} WIB`,

        poin: `+${item.poinMasuk}`,
        weight: `${item.beratKg} kg`,
      })),
      ...tukarList.map((item) => ({
        id: `tukar-${item.id}`,
        type: "keluar" as const,
        title: `Tukar ${item.product.namaProduct}`,
        createdAt: item.createdAt,

        dateKey: item.createdAt.toLocaleDateString("en-CA", {
          timeZone: "Asia/Jakarta",
        }),

        monthYear: item.createdAt.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),

        dateLabel: item.createdAt.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),

        time: `${item.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })} WIB`,

        poin: `-${item.poinKeluar}`,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    data = {
      saldo: poinWarga ? poinWarga.saldo : 0,
      transaksi,
    };

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_DASHBOARD",
        message: "Berhasil mengambil data dashboard",
        data,
      },
      { status: 200 }
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
      { status: 500 }
    );
  }
}
