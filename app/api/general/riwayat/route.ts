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
    const filter = (searchParams.get("filter") || "all").toLowerCase();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    if (!["all", "in", "out"].includes(filter)) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_FILTER",
          message: "Filter harus bernilai 'all', 'in', atau 'out'",
          data: null,
        },
        { status: 400 }
      );
    }

    let transaksiSetor: any[] | null = null;
    let transaksiTukar: any[] | null = null;

    if (filter === "all" || filter === "in") {
      const setorList = await prisma.transaksiSetor.findMany({
        where: { wargaId: identifier },
        include: {
          kategori: { select: { namaKategori: true } },
        },
        orderBy: { createdAt: "desc" },
        ...(limit ? { take: limit } : {}),
      });

      transaksiSetor = setorList.map((item) => ({
        namaKategori: item.kategori.namaKategori,
        poinMasuk: item.poinMasuk,
        createdAt: item.createdAt,
      }));
    }

    if (filter === "all" || filter === "out") {
      const tukarList = await prisma.transaksiTukar.findMany({
        where: { wargaId: identifier },
        include: {
          product: { select: { namaProduct: true } },
        },
        orderBy: { createdAt: "desc" },
        ...(limit ? { take: limit } : {}),
      });

      transaksiTukar = tukarList.map((item) => ({
        namaProduct: item.product.namaProduct,
        poinKeluar: item.poinKeluar,
        createdAt: item.createdAt,
      }));
    }

    if (filter === "in") {
      transaksiTukar = null;
    } else if (filter === "out") {
      transaksiSetor = null;
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_RIWAYAT",
        message: "Berhasil mengambil riwayat transaksi",
        data: {
          transaksiSetor,
          transaksiTukar,
        },
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
