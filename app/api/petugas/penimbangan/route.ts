import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Default categories if database is empty
const DEFAULT_CATEGORIES = [
  { namaKategori: "Plastik & Botol", ratePoinPerKg: 150, isActive: true },
  { namaKategori: "Kertas & Kardus", ratePoinPerKg: 100, isActive: true },
  { namaKategori: "Logam & Kaleng", ratePoinPerKg: 200, isActive: true },
  { namaKategori: "Minyak Jelantah", ratePoinPerKg: 250, isActive: true },
  { namaKategori: "Sampah Organik", ratePoinPerKg: 50, isActive: true },
  { namaKategori: "Elektronik & Lainnya", ratePoinPerKg: 500, isActive: true },
];

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

    let categories = await prisma.kategoriSampah.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });

    if (categories.length === 0) {
      // Auto seed default categories if none exist
      await prisma.kategoriSampah.createMany({
        data: DEFAULT_CATEGORIES,
      });

      categories = await prisma.kategoriSampah.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      });
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_KATEGORI",
        message: "Berhasil mengambil kategori sampah",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/petugas/penimbangan error:", error);
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

export async function POST(req: Request) {
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

    if (session.user.role !== "petugas") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDDEN",
          message: "Akses hanya untuk petugas.",
          data: null,
        },
        { status: 403 }
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

    const body = await req.json();
    const { wargaId, token, kategoriId, beratKg } = body;

    if (!wargaId || !kategoriId || beratKg === undefined || beratKg === null) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_INPUT",
          message: "Warga, kategori, dan berat sampah wajib diisi.",
          data: null,
        },
        { status: 400 }
      );
    }

    const parsedBerat = parseFloat(beratKg);
    if (isNaN(parsedBerat) || parsedBerat <= 0) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_WEIGHT",
          message: "Berat sampah harus lebih besar dari 0 kg.",
          data: null,
        },
        { status: 400 }
      );
    }

    const parsedKategoriId = parseInt(kategoriId, 10);
    const kategori = await prisma.kategoriSampah.findUnique({
      where: { id: parsedKategoriId },
    });

    if (!kategori) {
      return NextResponse.json(
        {
          status: 404,
          code: "KATEGORI_NOT_FOUND",
          message: "Kategori sampah tidak ditemukan.",
          data: null,
        },
        { status: 404 }
      );
    }

    const wargaUser = await prisma.user.findUnique({
      where: { id: wargaId },
    });

    if (!wargaUser) {
      return NextResponse.json(
        {
          status: 404,
          code: "USER_NOT_FOUND",
          message: "Data warga tidak ditemukan.",
          data: null,
        },
        { status: 404 }
      );
    }

    const poinMasuk = Math.round(parsedBerat * kategori.ratePoinPerKg);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create transaction record
      const transaksi = await tx.transaksiSetor.create({
        data: {
          wargaId: wargaUser.id,
          petugasId: identifier,
          kategoriId: parsedKategoriId,
          beratKg: parsedBerat,
          poinMasuk: poinMasuk,
        },
        include: {
          kategori: true,
          warga: {
            select: {
              id: true,
              name: true,
              noRumah: true,
            },
          },
        },
      });

      // 2. Update warga point balance
      const updatedPoin = await tx.poinWarga.upsert({
        where: { userId: wargaUser.id },
        update: {
          saldo: {
            increment: poinMasuk,
          },
        },
        create: {
          userId: wargaUser.id,
          saldo: poinMasuk,
        },
      });

      // 3. Create Notification for warga
      await tx.notification.create({
        data: {
          userId: wargaUser.id,
          title: "Setoran Sampah Berhasil",
          description: `Setoran ${kategori.namaKategori} seberat ${parsedBerat} kg telah berhasil diverifikasi. Anda mendapatkan +${poinMasuk} poin.`,
        },
      });

      // 4. Mark token as used if token is provided
      if (token) {
        await tx.qrToken.updateMany({
          where: { token: token },
          data: { isUsed: true },
        });
      }

      return {
        transaksi,
        saldo: updatedPoin.saldo,
      };
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_SIMPAN_PENIMBANGAN",
        message: `Berhasil menambahkan +${poinMasuk} poin untuk ${wargaUser.name}!`,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/petugas/penimbangan error:", error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal menyimpan penimbangan sampah",
        data: null,
      },
      { status: 500 }
    );
  }
}
