/**
 * POST /api/transaksi/verify-warga
 * Role: Petugas, Warung
 * Body: { qrPayload: string }
 * Res:  { status, code, data: { userId, namaWarga, blokRumah, saldoPoinSaatIni } }
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

    if (
      !session ||
      (session.user.role !== "petugas" && session.user.role !== "warung")
    ) {
      return NextResponse.json(
        { status: false, code: 401, message: "Unauthorized", data: null },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { qrPayload } = body;

    if (!qrPayload) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "QR payload is required",
          data: null,
        },
        { status: 400 },
      );
    }

    const qrRecord = await prisma.qrToken.findFirst({
      where: {
        token: String(qrPayload),
        isUsed: false,
        expiredAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            saldoPoinWarga: true,
          },
        },
      },
    });

    let targetUser: any = qrRecord?.user || null;

    if (!targetUser) {
      targetUser = await (prisma as any).user.findFirst({
        where: {
          OR: [
            { id: qrPayload },
            { id: isNaN(Number(qrPayload)) ? undefined : Number(qrPayload) },
          ].filter((cond) => cond.id !== undefined),
          role: "warga",
        },
        include: { saldoPoinWarga: true },
      });
    }

    if (!targetUser) {
      return NextResponse.json(
        {
          status: false,
          code: 404,
          message: "Warga tidak ditemukan atau QR kedaluwarsa",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Warga verified successfully",
      data: {
        userId: targetUser.id,
        namaWarga: targetUser.name,
        blokRumah: targetUser.noRumah || "-",
        saldoPoinSaatIni: targetUser.saldoPoinWarga?.saldo || 0,
      },
    });
  } catch (error) {
    console.error("VERIFY_WARGA_ERROR:", error);
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
