import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Query parameter 'token' wajib disertakan" },
        { status: 400 },
      );
    }

    const qrRecord = await prisma.qrToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            noRumah: true,
          },
        },
      },
    });

    if (!qrRecord) {
      return NextResponse.json(
        {
          success: false,
          status: "NOT_FOUND",
          message: "Token QR tidak valid atau tidak terdaftar",
        },
        { status: 404 },
      );
    }

    const now = new Date();
    const isExpired = now > qrRecord.expiredAt;

    let status: "ACTIVE" | "EXPIRED" | "USED" = "ACTIVE";
    if (qrRecord.isUsed) {
      status = "USED";
    } else if (isExpired) {
      status = "EXPIRED";
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          status,
          isUsed: qrRecord.isUsed,
          isExpired,
          expiredAt: qrRecord.expiredAt,
          user: qrRecord.user,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
