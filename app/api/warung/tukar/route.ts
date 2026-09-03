/**
 * POST /api/warung/tukar
 * Role: Warung
 * Body: { wargaId: string, items: Array<{ productId: number, qty: number }> }
 * Res:  { status, code, data: { namaWarga, totalPotonganPoin, sisaSaldoWarga, items, createdAt } }
 */

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { KatalogItem } from "@/types/katalog";
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

    if (role !== "warung") {
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
    const {
      wargaId,
      items,
      token,
    }: {
      wargaId: string;
      items: Array<{ item: KatalogItem; qty: number }>;
      token: string;
    } = body;

    if (!wargaId || !Array.isArray(items) || items.length === 0 || !token) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Input data penukaran tidak valid",
          data: null,
        },
        { status: 400 },
      );
    }

    const exToken = await prisma.qrToken.findFirst({
      where: {
        token,
        status: "success",
      },
    });

    if (exToken) {
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

    const productIds = items.map((item) => Number(item.item.id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== new Set(productIds).size) {
      return NextResponse.json(
        {
          status: 400,
          code: "PRODUCT_INVALID",
          message: "Beberapa produk tidak valid atau nonaktif",
          data: null,
        },
        { status: 400 },
      );
    }

    const invalidQty = items.some(
      (item) => !Number.isInteger(item.qty) || item.qty <= 0,
    );

    if (invalidQty) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_QTY",
          message: "Jumlah barang tidak valid",
          data: null,
        },
        { status: 400 },
      );
    }

    let totalPoinDibutuhkan = 0;

    const itemsSummary = items.map((item) => {
      const prod = products.find((p) => p.id === item.item.id)!;
      const subtotalPoin = prod.hargaPoin * item.qty;
      totalPoinDibutuhkan += subtotalPoin;
      return {
        productId: prod.id,
        namaProduct: prod.namaProduct,
        qty: item.qty,
        totalPoin: subtotalPoin,
      };
    });

    const config = await prisma.konfigurasi?.findFirst?.();

    if (!config) {
      return NextResponse.json(
        {
          status: 404,
          code: "KONFIGURASI_NOT_FOUND",
          message: "Konfigurasi tidak ditemukan",
          data: null,
        },
        { status: 404 },
      );
    }

    const rateKonversi = config.ratePoinKeRupiah;
    const totalRupiahWarung = totalPoinDibutuhkan * rateKonversi;

    const result = await prisma.$transaction(async (tx) => {
      const poinWarga = await tx.poinWarga.findUnique({
        where: { userId: wargaId },
      });

      if (!poinWarga || poinWarga.saldo < totalPoinDibutuhkan) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const updatedPoinWarga = await tx.poinWarga.update({
        where: { userId: wargaId },
        data: { saldo: { decrement: totalPoinDibutuhkan } },
      });

      await tx.poinWarung.upsert({
        where: { userId: session.user.id },
        update: {
          saldoPoinTukarWarung: { increment: totalPoinDibutuhkan },
          saldoRupiah: { increment: totalRupiahWarung },
        },
        create: {
          userId: identifier,
          saldoPoinTukarWarung: totalPoinDibutuhkan,
          saldoRupiah: totalRupiahWarung,
        },
      });

      const transkasiTukar = await tx.transaksiTukar.create({
        data: {
          wargaId,
          warungId: identifier,
          totalPoin: totalPoinDibutuhkan,
        },
      });

      for (const item of items) {
        const prod = products.find((p) => p.id === Number(item.item.id))!;

        await tx.transaksiTukarDetail.create({
          data: {
            transaksiId: transkasiTukar.id,
            productId: prod.id,
            qty: item.qty,
            poin: prod.hargaPoin * item.qty,
          },
        });
      }

      const warga = await tx.user.findUnique({
        where: { id: wargaId },
      });

      return {
        transaksiId: transkasiTukar.id,
        wargaId: warga?.id,
        sisaSaldo: updatedPoinWarga.saldo,
        createdAt: transkasiTukar.createdAt,
      };
    });

    if (result) {
      await prisma.qrToken.update({
        where: {
          token,
        },
        data: {
          status: "success",
        },
      });
    }

    return NextResponse.json(
      {
        status: 201,
        code: "SUCCESS_CREATE_TRANSAKSI_TUKAR",
        message: "Penukaran barang berhasil diproses",
        data: {
          transaksiId: result.transaksiId,
          wargaId: result.wargaId,
          totalPotonganPoin: totalPoinDibutuhkan,
          sisaSaldoWarga: result.sisaSaldo,
          items: itemsSummary,
          createdAt: result.createdAt,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    const err = error as Error;

    if (err.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        {
          status: 400,
          code: "INSUFFICIENT_BALANCE",
          message: "Saldo poin warga tidak mencukupi",
          data: null,
        },
        { status: 400 },
      );
    }
    console.error("TUKAR_WARUNG_ERROR:", error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
