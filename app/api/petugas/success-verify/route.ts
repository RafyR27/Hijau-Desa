import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { userRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
          message: "Akses ditolak.",
          data: null,
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    const wargaId = searchParams.get("wargaId") || "";
    const transaksiId = searchParams.get("transaksiId") || "";

    const exToken = await prisma.qrToken.findFirst({
      where: {
        token,
        status: "success",
      },
    });

    if (!exToken) {
      return NextResponse.json(
        {
          status: 404,
          code: "NOT_FOUND",
          message: "Token tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    const exWarga = await prisma.user.findFirst({
      where: {
        id: wargaId,
        statusVerifikasi: true,
      },
    });

    if (!exWarga) {
      return NextResponse.json(
        {
          status: 404,
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    const result = await prisma.transaksiSetor.findFirst({
      where: {
        id: transaksiId,
        wargaId,
        petugasId: identifier,
      },
      include: {
        warga: true,
        kategori: true,
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          status: 404,
          code: "NOT_FOUND",
          message: "Transaksi tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_TRANSACTION",
        message: "Berhasil mengambil data transaksi",
        data: {
          transaksiId: result.id,
          namaWarga: result.warga?.name,
          kategoriSampah: result.kategori?.namaKategori,
          beratSampah: result.beratKg,
          rate: result.kategori?.ratePoinPerKg,
          totalPoin: result.poinMasuk,
          createdAt: result.createdAt,
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
