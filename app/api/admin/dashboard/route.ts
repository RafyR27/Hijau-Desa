import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminRateLimit } from "@/lib/rate-limit";
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDDEN",
          message: "Akses ditolak. Khusus admin.",
          data: null,
        },
        { status: 403 }
      );
    }

    const identifier = session.user.id;
    const rateLimit = await adminRateLimit.limit(identifier);

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

    const totalPengguna = await prisma.user.count();
    const totalWargaBaruMendaftar = await prisma.user.count({
      where: { statusVerifikasi: false, role: "warga" },
    });

    const aggregateSampah = await prisma.transaksiSetor.aggregate({
      _sum: { beratKg: true, poinMasuk: true },
    });

    const totalTransaksiSetor = await prisma.transaksiSetor.count();
    const totalPoinTerdistribusi = aggregateSampah._sum.poinMasuk || 0;
    const totalSampah = aggregateSampah._sum.beratKg || 0;

    const totalPengajuanReimburs = 0;

    const kategoriAktif = await prisma.kategoriSampah.count({
      where: { isActive: true },
    });

    const ProdukAktif = await prisma.product.count({
      where: { isActive: true },
    });

    const config = await prisma.konfigurasi.findFirst();
    const konversiPoin = config ? config.ratePoinKeRupiah : 100;

    return NextResponse.json(
      {
        status: 200,
        message: "Dashboard admin berhasil diambil",
        data: {
          totalPengguna,
          totalSampah,
          totalTransaksiSetor,
          totalPoinTerdistribusi,
          totalWargaBaruMendaftar,
          totalPengajuanReimburs,
          ringkasanSistem: {
            kategoriAktif,
            ProdukAktif,
            konversiPoin,
          },
        },
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
      { status: 500 },
    );
  }
}
