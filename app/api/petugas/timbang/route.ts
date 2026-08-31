/**
 * POST /api/petugas/timbang
 * Role: Petugas
 * Body: { wargaId: string, kategoriSampahId: number, berat: number }
 * Res:  { status, code, data: { transaksiId, namaWarga, beratSampah, totalPoin, createdAt } }
 */

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "petugas") {
      return NextResponse.json(
        {
          status: false,
          code: 403,
          message: "Akses ditolak. Khusus petugas",
          data: null,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { wargaId, kategoriSampahId, berat } = body;

    const beratKg = parseFloat(berat);
    const katId = parseInt(kategoriSampahId);

    if (!wargaId || isNaN(beratKg) || beratKg <= 0 || isNaN(katId)) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Input data penimbangan tidak valid",
          data: null,
        },
        { status: 400 },
      );
    }

    const kategori = await prisma.kategoriSampah.findFirst({
      where: { id: katId, isActive: true },
    });
    
    if (!kategori) {
      return NextResponse.json(
        {
          status: false,
          code: 404,
          message: "Kategori sampah tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    const totalPoin = Math.floor(beratKg * kategori.ratePoinPerKg);

    const result: any = await prisma.$transaction(async (tx: any) => {
      const transaksi = await tx.transaksiSetor.create({
        data: {
          wargaId: String(wargaId),
          petugasId: session.user.id,
          kategoriId: katId,
          beratKg,
          poinMasuk: totalPoin,
        },
        include: { warga: true },
      });

      await tx.poinWarga.upsert({
        where: { userId: String(wargaId) },
        update: { saldo: { increment: totalPoin } },
        create: { userId: String(wargaId), saldo: totalPoin },
      });

      await tx.notification.create({
        data: {
          userId: String(wargaId),
          title: "Setor Sampah Berhasil!",
          description: `Kamu mendapatkan +${totalPoin} poin dari setoran sampah ${kategori.namaKategori} (${beratKg} kg).`,
        },
      });

      return transaksi;
    });

    return NextResponse.json({
      status: true,
      code: 201,
      message: "Transaksi penimbangan berhasil",
      data: {
        transaksiId: result.id,
        namaWarga: result.warga?.name || "-",
        beratSampah: result.beratKg,
        totalPoin: result.poinMasuk,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error("TIMBANG_ERROR:", error);
    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
