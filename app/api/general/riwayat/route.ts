import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limit";
import { Transaction } from "@/types/riwayat";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type FilterType = "all" | "in" | "out" | "reimburse";

function isValidDateFormat(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidDate(value: string) {
  const date = new Date(`${value}T00:00:00+07:00`);

  return !Number.isNaN(date.getTime());
}

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
        { status: 429 },
      );
    }

    const { searchParams } = new URL(request.url);

    const filter = (
      searchParams.get("filter") || "all"
    ).toLowerCase() as FilterType;

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const limitParam = searchParams.get("limit");

    let limit = limitParam ? Number(limitParam) : 10;

    if (!["all", "in", "out", "reimburse"].includes(filter)) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_FILTER",
          message: "Filter harus bernilai 'all', 'in', atau 'out'",
          data: null,
        },
        { status: 400 },
      );
    }

    if (limitParam !== null) {
      const parsedLimit = Number(limitParam);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit <= 0 ||
        parsedLimit > 100
      ) {
        return NextResponse.json(
          {
            status: 400,
            code: "INVALID_LIMIT",
            message: "Limit harus berupa bilangan bulat antara 1 dan 100",
            data: null,
          },
          { status: 400 },
        );
      }

      limit = parsedLimit;
    }

    if (startDateParam) {
      if (!isValidDateFormat(startDateParam) || !isValidDate(startDateParam)) {
        return NextResponse.json(
          {
            status: 400,
            code: "INVALID_START_DATE",
            message: "startDate harus menggunakan format YYYY-MM-DD",
            data: null,
          },
          { status: 400 },
        );
      }
    }

    if (endDateParam) {
      if (!isValidDateFormat(endDateParam) || !isValidDate(endDateParam)) {
        return NextResponse.json(
          {
            status: 400,
            code: "INVALID_END_DATE",
            message: "endDate harus menggunakan format YYYY-MM-DD",
            data: null,
          },
          { status: 400 },
        );
      }
    }

    if (startDateParam && endDateParam) {
      const start = new Date(`${startDateParam}T00:00:00+07:00`);

      const end = new Date(`${endDateParam}T00:00:00+07:00`);

      if (start > end) {
        return NextResponse.json(
          {
            status: 400,
            code: "INVALID_DATE_RANGE",
            message: "startDate tidak boleh lebih besar dari endDate",
            data: null,
          },
          { status: 400 },
        );
      }
    }

    let startDate: Date | undefined;
    let endDateExclusive: Date | undefined;

    if (startDateParam) {
      startDate = new Date(`${startDateParam}T00:00:00+07:00`);
    }

    if (endDateParam) {
      endDateExclusive = new Date(`${endDateParam}T00:00:00+07:00`);

      endDateExclusive.setDate(endDateExclusive.getDate() + 1);
    }

    const dateFilter =
      startDate || endDateExclusive
        ? {
            createdAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDateExclusive ? { lt: endDateExclusive } : {}),
            },
          }
        : {};

    let transaksiReimbursement: Array<{
      id: number;
      jumlahPoin: number;
      jumlahRupiah: number;
      status: boolean;
      createdAt: Date;
    }> = [];

    let transaksiSetor: Array<{
      id: string;
      namaKategori: string;
      beratKg: number;
      poinMasuk: number;
      createdAt: Date;
    }> = [];

    let transaksiTukar: Array<{
      id: string;
      products: string;
      poinKeluar: number;
      createdAt: Date;
    }> = [];

    // Role-based transaction fetching
    if (role === "warga") {
      if (filter === "all" || filter === "in") {
        const setorList = await prisma.transaksiSetor.findMany({
          where: {
            wargaId: identifier,
            ...dateFilter,
          },
          include: {
            kategori: {
              select: {
                namaKategori: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        transaksiSetor = setorList.map((item) => ({
          id: item.id,
          namaKategori: item.kategori.namaKategori,
          beratKg: item.beratKg,
          poinMasuk: item.poinMasuk,
          createdAt: item.createdAt,
        }));
      }

      if (filter === "all" || filter === "out") {
        const tukarList = await prisma.transaksiTukar.findMany({
          where: {
            wargaId: identifier,
            ...dateFilter,
          },
          include: {
            details: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        transaksiTukar = tukarList.map((item) => ({
          id: item.id,
          products: item.details
            .map((detail) => detail.product.namaProduct)
            .join(", "),
          poinKeluar: item.totalPoin,
          createdAt: item.createdAt,
        }));
      }
    } else if (role === "petugas") {
      // Petugas hanya memiliki transaksi setor (melayani/menimbang sampah warga)
      if (filter === "all" || filter === "in") {
        const setorList = await prisma.transaksiSetor.findMany({
          where: {
            petugasId: identifier,
            ...dateFilter,
          },
          include: {
            kategori: {
              select: {
                namaKategori: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        transaksiSetor = setorList.map((item) => ({
          id: item.id,
          namaKategori: item.kategori.namaKategori,
          beratKg: item.beratKg,
          poinMasuk: item.poinMasuk,
          createdAt: item.createdAt,
        }));
      }
    } else if (role === "warung") {
      // Warung: transaksi penukaran (poin masuk) + pencairan dana (reimburse)
      if (filter === "all" || filter === "in") {
        const tukarList = await prisma.transaksiTukar.findMany({
          where: {
            warungId: identifier,
            ...dateFilter,
          },
          include: {
            details: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        transaksiTukar = tukarList.map((item) => ({
          id: item.id,
          products: item.details
            .map((detail) => detail.product.namaProduct)
            .join(", "),
          poinKeluar: item.totalPoin,
          createdAt: item.createdAt,
        }));
      }

      if (filter === "all" || filter === "reimburse") {
        const reimbList = await prisma.reimbursement.findMany({
          where: {
            warungId: identifier,
            ...dateFilter,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        transaksiReimbursement = reimbList.map((item) => ({
          id: item.id,
          jumlahPoin: item.jumlahPoin,
          jumlahRupiah: item.jumlahRupiah,
          status: item.status,
          createdAt: item.createdAt,
        }));
      }
    }

    const transactions: Transaction[] = [
      ...transaksiSetor.map((item) => ({
        type: "in" as const,
        ...item,
      })),

      ...transaksiTukar.map((item) => ({
        type: "out" as const,
        ...item,
      })),
    ];

    transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const limitedTransactions = transactions.slice(0, limit);

    const resultTransactions = limitedTransactions.map((item) => {
      if (item.type === "in") {
        return {
          id: `setor-${item.id}`,
          type: "masuk" as const,
          title: `Setor ${item.namaKategori}`,
          createdAt: item.createdAt,

          dateKey: item.createdAt.toLocaleDateString("en-CA", {
            timeZone: "Asia/Jakarta",
          }),

          monthYear: item.createdAt.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          }),

          dateLabel: item.createdAt.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          }),

          time: `${item.createdAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
          })} WIB`,

          poin: `+${item.poinMasuk}`,
          weight: `${item.beratKg} kg`,
        };
      }

      if (role === "warung") {
        return {
          id: `tukar-${item.id}`,
          type: "masuk" as const,
          title: `Penukaran ${item.products}`,
          createdAt: item.createdAt,

          dateKey: item.createdAt.toLocaleDateString("en-CA", {
            timeZone: "Asia/Jakarta",
          }),

          monthYear: item.createdAt.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          }),

          dateLabel: item.createdAt.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          }),

          time: `${item.createdAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
          })} WIB`,

          poin: `+${item.poinKeluar}`,
        };
      }

      return {
        id: `tukar-${item.id}`,
        type: "keluar" as const,
        title: `Tukar ${item.products}`,
        createdAt: item.createdAt,

        dateKey: item.createdAt.toLocaleDateString("en-CA", {
          timeZone: "Asia/Jakarta",
        }),

        monthYear: item.createdAt.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),

        dateLabel: item.createdAt.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),

        time: `${item.createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })} WIB`,

        poin: `-${item.poinKeluar}`,
      };
    });

    // Gabungkan reimbursement warung ke dalam hasil jika ada
    const reimbursementResults = transaksiReimbursement.map((item) => ({
      id: `reimb-${item.id}`,
      type: "reimburse" as const,
      title: "Pencairan Dana",
      createdAt: item.createdAt,

      dateKey: item.createdAt.toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      }),

      monthYear: item.createdAt.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }),

      dateLabel: item.createdAt.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }),

      time: `${item.createdAt.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })} WIB`,

      poin: `-Rp ${item.jumlahRupiah.toLocaleString("id-ID")}`,
      reimbursementStatus: item.status,
    }));

    // Gabung semua, urutkan ulang berdasarkan tanggal
    const allResults = [...resultTransactions, ...reimbursementResults]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_RIWAYAT",
        message: "Berhasil mengambil riwayat transaksi",

        data: {
          transactions: allResults,
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
