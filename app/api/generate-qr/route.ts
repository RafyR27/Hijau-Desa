// Request Body:
// {
//   "userId": "string (UUID / User ID)"
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateQRCodeDataURL } from "@/lib/qr";
import { randomBytes } from "crypto";

const QR_EXPIRY_MINUTES = 1;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = Number(body?.userId);

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "userId valid wajib disertakan" },
        { status: 400 },
      );
    }

    // Validasi userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        noRumah: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: `User ID ${userId} tidak ditemukan` },
        { status: 404 },
      );
    }

    // Generate token
    const token = `HD-${randomBytes(16).toString("hex")}`;
    const expiredAt = new Date(Date.now() + QR_EXPIRY_MINUTES * 60 * 1000);

    // Token -> Database
    const qrRecord = await prisma.qrToken.create({
      data: {
        token,
        userId: user.id,
        expiredAt,
        isUsed: false,
      },
    });

    // Generate QR Base64 Data URL
    const qrImage = await generateQRCodeDataURL(qrRecord.token);

    return NextResponse.json(
      {
        success: true,
        message: "QR Code berhasil digenerate",
        data: {
          tokenId: qrRecord.id,
          token: qrRecord.token,
          qrImage,
          expiredAt: qrRecord.expiredAt,
          user,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
