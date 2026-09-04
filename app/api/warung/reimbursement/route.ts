import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { userRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

    if (role !== "warung") {
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

    const body = await req.json();
    const { jumlahPoin }: { jumlahPoin: number } = body;

    if (!jumlahPoin || !Number.isInteger(jumlahPoin) || jumlahPoin <= 0) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Jumlah poin tidak valid.",
          data: null,
        },
        { status: 400 },
      );
    }

    const poinWarung = await prisma.poinWarung.findUnique({
      where: { userId: identifier },
    });

    if (!poinWarung || poinWarung.saldoPoinTukarWarung < jumlahPoin) {
      return NextResponse.json(
        {
          status: 400,
          code: "INSUFFICIENT_BALANCE",
          message: "Saldo poin warung tidak mencukupi.",
          data: null,
        },
        { status: 400 },
      );
    }

    // Cek apakah ada pengajuan yang masih pending
    const pendingReimbursement = await prisma.reimbursement.findFirst({
      where: {
        warungId: identifier,
        status: false,
      },
    });

    if (pendingReimbursement) {
      return NextResponse.json(
        {
          status: 409,
          code: "PENDING_REIMBURSEMENT_EXISTS",
          message:
            "Masih ada pengajuan pencairan dana yang sedang diproses. Mohon tunggu hingga selesai.",
          data: null,
        },
        { status: 409 },
      );
    }

    // Ambil konfigurasi rate konversi
    const konfigurasi = await prisma.konfigurasi.findFirst();
    if (!konfigurasi) {
      return NextResponse.json(
        {
          status: 404,
          code: "KONFIGURASI_NOT_FOUND",
          message: "Konfigurasi tidak ditemukan.",
          data: null,
        },
        { status: 404 },
      );
    }

    const jumlahRupiah = jumlahPoin * konfigurasi.ratePoinKeRupiah;

    if (jumlahRupiah < 50000) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message:
            "Jumlah poin yang ingin dicairkan harus lebih dari Rp. 50.000.",
          data: null,
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedPoin = await tx.poinWarung.update({
        where: { userId: identifier },
        data: {
          saldoPoinTukarWarung: { decrement: jumlahPoin },
          saldoRupiah: { decrement: jumlahRupiah },
        },
      });

      const reimbursement = await tx.reimbursement.create({
        data: {
          warungId: identifier,
          jumlahPoin,
          jumlahRupiah,
          status: false,
        },
      });

      return { updatedPoin, reimbursement };
    });

    return NextResponse.json(
      {
        status: 201,
        code: "SUCCESS_CREATE_REIMBURSEMENT",
        message: "Pengajuan pencairan dana berhasil dibuat",
        data: {
          id: result.reimbursement.id,
          jumlahPoin,
          jumlahRupiah,
          sisaSaldoPoin: result.updatedPoin.saldoPoinTukarWarung,
          sisaSaldoRupiah: result.updatedPoin.saldoRupiah,
        },
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
