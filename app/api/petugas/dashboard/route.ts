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

    if (role !== "petugas") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDDEN",
          message: "Anda tidak memiliki akses ke fitur ini.",
          data: null,
        },
        { status: 403 }
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

    // 1. Ambil 5 transaksi setor terbaru yang diproses oleh petugas ini
    const setorList = await prisma.transaksiSetor.findMany({
      where: { petugasId: identifier },
      include: {
        kategori: { select: { namaKategori: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // 2. Hitung total sampah (kg) dan total transaksi setor yang dilayani petugas
    const aggregations = await prisma.transaksiSetor.aggregate({
      where: { petugasId: identifier },
      _sum: {
        beratKg: true,
      },
      _count: {
        id: true,
      },
    });

    const totalSampah = aggregations._sum.beratKg ?? 0;
    const totalSetor = aggregations._count.id ?? 0;

    // 3. Format daftar transaksi agar sesuai dengan komponen CardRiwayat / TransactionItem
    const transaksi = setorList.map((item) => ({
      id: `setor-${item.id}`,
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
    }));

    const data = {
      totalSampah,
      totalSetor,
      transaksi,
    };

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_DASHBOARD",
        message: "Berhasil mengambil data dashboard petugas",
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
