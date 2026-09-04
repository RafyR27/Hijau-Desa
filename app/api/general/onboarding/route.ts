import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          status: 401,
          code: "UNAUTHORIZED",
          message: "Sesi Anda telah berakhir",
          data: null,
        },
        { status: 401 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        newAccount: false,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_ONBOARDING",
        message: "Status onboarding berhasil diperbarui",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/general/onboarding error:", error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server",
        data: null,
      },
      { status: 500 }
    );
  }
}
