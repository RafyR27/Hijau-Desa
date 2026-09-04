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
import { userRateLimit } from "@/lib/rate-limit";

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
        { status: 401 },
      );
    }

    const identifier = session.user.id;
    const role = session.user.role;

    const rateLimit = await userRateLimit.limit(identifier);

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

    if (role !== "petugas") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDDEN",
          message: "Akses ditolak",
          data: null,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { wargaId, kategoriSampahId, berat, token } = body;

    const beratKg = berat;
    const katId = kategoriSampahId;

    if (!wargaId || beratKg <= 0 || katId <= 0 || !token) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Input data penimbangan tidak valid",
          data: null,
        },
        { status: 400 },
      );
    }

    const exToken = await prisma.qrToken.findFirst({
      where:{
        token,
        status: "success"
      }
    })

    if(exToken){
      return NextResponse.json(
        {
          status: 409,
          code: "TOKEN_ALREDY_USED",
          message: "Token sudah digunakan",
          data: null,
        },
        { status: 409 },
      );
    }


    const kategori = await prisma.kategoriSampah.findFirst({
      where: { id: katId, isActive: true },
    });

    if (!kategori) {
      return NextResponse.json(
        {
          status: 404,
          code: "NOT_FOUND",
          message: "Kategori sampah tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    const totalPoin = Math.floor(beratKg * kategori.ratePoinPerKg);

    const result = await prisma.$transaction(async (tx) => {
      const transaksi = await tx.transaksiSetor.create({
        data: {
          wargaId: String(wargaId),
          petugasId: identifier,
          kategoriId: katId,
          beratKg,
          poinMasuk: totalPoin,
        },
      });

      await tx.poinWarga.upsert({
        where: { userId: String(wargaId) },
        update: { saldo: { increment: totalPoin } },
        create: { userId: String(wargaId), saldo: totalPoin },
      });

      await tx.qrToken.update({
        where: {
          token
        },
        data: {
          status: "success"
        }
      })

      return transaksi;
    });

    return NextResponse.json(
      {
        status: 201,
        code: "SUCCESS_CREATE_TRANSAKSI_SETOR",
        message: "Transaksi penimbangan berhasil",
        data: result,
      },
      { status: 201 },
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
