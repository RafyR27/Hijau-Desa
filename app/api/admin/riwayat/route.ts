import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { adminRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type TransaksiSetorQuery = Prisma.TransaksiSetorGetPayload<{
  include: {
    warga: {
      select: {
        name: true;
      };
    };
    petugas: {
      select: {
        name: true;
      };
    };
    kategori: {
      select: {
        namaKategori: true;
      };
    };
  };
}>;

type TransaksiTukarQuery = Prisma.TransaksiTukarGetPayload<{
  include: {
    warga: {
      select: {
        name: true;
      };
    };
    warung: {
      select: {
        name: true;
      };
    };
    details: {
      include: {
        product: true;
      };
    };
  };
}>;

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
        { status: 401 },
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
        { status: 403 },
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
        { status: 429 },
      );
    }

    const url = new URL(request.url);
    const pageIndex = parseInt(url.searchParams.get("pageIndex") || "0");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "Semua";

    const config = await prisma.konfigurasi.findFirst();
    const rateRupiah = config ? config.ratePoinKeRupiah : 100;

    let transaksiSetorList: TransaksiSetorQuery[] = [];
    let transaksiTukarList: TransaksiTukarQuery[] = [];

    if (filter === "Semua" || filter === "Setor") {
      transaksiSetorList = await prisma.transaksiSetor.findMany({
        where: search
          ? {
              OR: [
                { warga: { name: { contains: search, mode: "insensitive" } } },
                {
                  petugas: { name: { contains: search, mode: "insensitive" } },
                },
              ],
            }
          : undefined,
        include: {
          warga: { select: { name: true } },
          petugas: { select: { name: true } },
          kategori: { select: { namaKategori: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (filter === "Semua" || filter === "Tukar") {
      transaksiTukarList = await prisma.transaksiTukar.findMany({
        where: search
          ? {
              OR: [
                { warga: { name: { contains: search, mode: "insensitive" } } },
                { warung: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : undefined,
        include: {
          warga: { select: { name: true } },
          warung: { select: { name: true } },
          details: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const formattedSetor = transaksiSetorList.map((item) => ({
      id: `setor_${item.id}`,
      jenis: "setor",
      warga: item.warga.name,
      anggota: item.petugas.name,
      detailItem: `${item.kategori.namaKategori} (${item.beratKg} Kg)`,
      poin: `+${item.poinMasuk}`,
      amountRupiah: item.poinMasuk * rateRupiah,
      createdAt: item.createdAt,
    }));

    const formattedTukar = transaksiTukarList.map((item) => ({
      id: `tukar_${item.id}`,
      jenis: "tukar",
      warga: item.warga.name,
      anggota: item.warung.name,
      detailItem: item.details
        .map((detail) => detail.product.namaProduct)
        .join(", "),
      poin: `-${item.totalPoin}`,
      amountRupiah: item.totalPoin * rateRupiah,
      createdAt: item.createdAt,
    }));

    const combined = [...formattedSetor, ...formattedTukar].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const paginated = combined.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize,
    );

    return NextResponse.json(
      {
        status: 200,
        message: "Riwayat semua transaksi berhasil diambil",
        data: {
          transaksi: paginated,
          total: combined.length,
          pageIndex,
          pageSize,
        },
      },
      { status: 200 },
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
