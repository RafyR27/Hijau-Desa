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

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "warung") {
      return NextResponse.json(
        {
          status: false,
          code: 403,
          message: "Akses ditolak. Khusus mitra warung",
          data: null,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      wargaId,
      items,
    }: { wargaId: string; items: Array<{ productId: any; qty: number }> } =
      body;

    if (!wargaId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Daftar barang tidak boleh kosong",
          data: null,
        },
        { status: 400 },
      );
    }

    const productIds = items.map((i) => parseInt(String(i.productId)));
    const products: any[] = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Beberapa produk tidak valid atau nonaktif",
          data: null,
        },
        { status: 400 },
      );
    }

    let totalPoinDibutuhkan = 0;
    const itemsSummary = items.map((item) => {
      const prod = products.find(
        (p: any) => p.id === parseInt(String(item.productId)),
      )!;
      const subtotalPoin = prod.hargaPoin * item.qty;
      totalPoinDibutuhkan += subtotalPoin;
      return {
        productId: prod.id,
        namaProduct: prod.namaProduct,
        qty: item.qty,
        totalPoin: subtotalPoin,
      };
    });

    const config = await (prisma as any).konfigurasi?.findFirst?.();
    const rateKonversi = config?.ratePoinKeRupiah ?? 100;
    const totalRupiahWarung = totalPoinDibutuhkan * rateKonversi;

    const result: any = await prisma.$transaction(async (tx: any) => {
      const poinWarga = await tx.poinWarga.findUnique({
        where: { userId: String(wargaId) },
      });

      if (!poinWarga || poinWarga.saldo < totalPoinDibutuhkan) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const updatedPoinWarga = await tx.poinWarga.update({
        where: { userId: String(wargaId) },
        data: { saldo: { decrement: totalPoinDibutuhkan } },
      });

      await tx.poinWarung.upsert({
        where: { userId: session.user.id },
        update: {
          saldoPoinTukarWarung: { increment: totalPoinDibutuhkan },
          saldoRupiah: { increment: totalRupiahWarung },
        },
        create: {
          userId: session.user.id,
          saldoPoinTukarWarung: totalPoinDibutuhkan,
          saldoRupiah: totalRupiahWarung,
        },
      });

      for (const item of items) {
        const prod = products.find(
          (p: any) => p.id === parseInt(String(item.productId)),
        )!;
        for (let i = 0; i < item.qty; i++) {
          await tx.transaksiTukar.create({
            data: {
              wargaId: String(wargaId),
              warungId: session.user.id,
              productId: prod.id,
              poinKeluar: prod.hargaPoin,
            },
          });
        }
      }

      const warga = await tx.user.findUnique({
        where: { id: String(wargaId) },
      });

      return {
        namaWarga: warga?.name || "-",
        sisaSaldo: updatedPoinWarga.saldo,
      };
    });

    return NextResponse.json({
      status: true,
      code: 201,
      message: "Penukaran barang berhasil diproses",
      data: {
        namaWarga: result.namaWarga,
        totalPotonganPoin: totalPoinDibutuhkan,
        sisaSaldoWarga: result.sisaSaldo,
        items: itemsSummary,
        createdAt: new Date(),
      },
    });
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Saldo poin warga tidak mencukupi",
          data: null,
        },
        { status: 400 },
      );
    }
    console.error("TUKAR_WARUNG_ERROR:", error);
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
