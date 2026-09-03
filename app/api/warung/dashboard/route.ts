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
        { status: 401 },
      );
    }

    const identifier = session.user.id;
    const role = session.user.role;

    if (role !== "warung") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDDEN",
          message: "Anda tidak memiliki akses ke fitur ini.",
          data: null,
        },
        { status: 403 },
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
        { status: 429 },
      );
    }

    const poinWarung = await prisma.poinWarung.findUnique({
      where: { userId: identifier },
    });

    const konfigurasi = await prisma.konfigurasi.findFirst();
    const ratePoinKeRupiah = konfigurasi?.ratePoinKeRupiah ?? 100;

    const tukarList = await prisma.transaksiTukar.findMany({
      where: { warungId: identifier },
      include: {
        details: {
          include: {
            product: true,
          },
        },
        warga: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const reimbursementList = await prisma.reimbursement.findMany({
      where: { warungId: identifier },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const pendingReimbursement = await prisma.reimbursement.findFirst({
      where: {
        warungId: identifier,
        status: false,
      },
      orderBy: { createdAt: "desc" },
    });

    const transaksiTukar = tukarList.map((item) => ({
      id: `tukar-${item.id}`,
      type: "penukaran" as const,
      title: `Penukaran ${item.details
        .map((d) => d.product.namaProduct)
        .join(", ")}`,
      namaWarga: item.warga.name,
      poin: `-${item.totalPoin}`,
      rupiah: `+Rp ${(item.totalPoin * ratePoinKeRupiah).toLocaleString("id-ID")}`,
      time: `${item.createdAt.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })} WIB`,
      dateLabel: item.createdAt.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }),
      createdAt: item.createdAt,
    }));

    const transaksiPencairan = reimbursementList.map((item) => ({
      id: `reimb-${item.id}`,
      type: "pencairan" as const,
      title: "Pencairan Dana",
      poin: `-${item.jumlahPoin}`,
      rupiah: `-Rp ${item.jumlahRupiah.toLocaleString("id-ID")}`,
      status: item.status,
      time: `${item.createdAt.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })} WIB`,
      dateLabel: item.createdAt.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }),
      createdAt: item.createdAt,
    }));

    const allTransaksi = [...transaksiTukar, ...transaksiPencairan]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4);

    const totalPoinTerkumpul = tukarList.reduce(
      (sum, item) => sum + item.totalPoin,
      0,
    );
    const totalPencairan = reimbursementList.reduce(
      (sum, item) => sum + item.jumlahRupiah,
      0,
    );

    const data = {
      saldoPoin: poinWarung?.saldoPoinTukarWarung ?? 0,
      saldoRupiah: poinWarung?.saldoRupiah ?? 0,
      ratePoinKeRupiah,
      hasPendingReimbursement: !!pendingReimbursement,
      pendingJumlahRupiah: pendingReimbursement
        ? pendingReimbursement.jumlahRupiah
        : 0,
      stats: {
        totalTransaksiPenukaran: tukarList.length,
        totalPoinTerkumpul,
        totalPencairan,
      },
      transaksi: allTransaksi,
    };

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_WARUNG_DASHBOARD",
        message: "Berhasil mengambil data dashboard warung",
        data,
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
