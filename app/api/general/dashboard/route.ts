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

    let data: any = {};

    if (role === "warga") {
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

      data = {
        saldo: poinWarga ? poinWarga.saldo : 0,
        transaksiSetor: setorList.map((item) => ({
          namaKategori: item.kategori.namaKategori,
          poinMasuk: item.poinMasuk,
          createdAt: item.createdAt,
        })),
        transaksiTukar: tukarList.map((item) => ({
          namaProduct: item.product.namaProduct,
          poinKeluar: item.poinKeluar,
          createdAt: item.createdAt,
        })),
      };
    } else if (role === "warung") {
      const poinWarung = await prisma.poinWarung.findUnique({
        where: { userId: identifier },
      });

      const tukarList = await prisma.transaksiTukar.findMany({
        where: { warungId: identifier },
        include: {
          product: { select: { namaProduct: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      data = {
        saldoPoinTukarWarung: poinWarung ? poinWarung.saldoPoinTukarWarung : 0,
        saldoRupiah: poinWarung ? poinWarung.saldoRupiah : 0,
        transaksiTukar: tukarList.map((item) => ({
          namaProduct: item.product.namaProduct,
          poinKeluar: item.poinKeluar,
          createdAt: item.createdAt,
        })),
      };
    } else if (role === "petugas" || role === "admin") {
      const setorList = await prisma.transaksiSetor.findMany({
        where: role === "petugas" ? { petugasId: identifier } : {},
        include: {
          kategori: { select: { namaKategori: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      const allSetor = await prisma.transaksiSetor.findMany({
        where: role === "petugas" ? { petugasId: identifier } : {},
      });

      const totalSampah = allSetor.reduce((acc, curr) => acc + curr.beratKg, 0);
      const totalSetor = allSetor.length;

      data = {
        totalSampah,
        totalSetor,
        transaksiSetor: setorList.map((item) => ({
          namaKategori: item.kategori.namaKategori,
          poinMasuk: item.poinMasuk,
          createdAt: item.createdAt,
        })),
      };
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_DASHBOARD",
        message: "Berhasil mengambil data dashboard",
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
