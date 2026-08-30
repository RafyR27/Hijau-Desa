import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
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
    const rateLimit = await adminRateLimit.limit(identifier);

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

    if (role !== "admin") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDEN",
          message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          data: null,
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        {
          status: 400,
          code: "BAD_REQUEST",
          message: "ID user wajib disertakan.",
          data: null,
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { status, alasan } = body;

    let warga;

    if (status === "Terima") {
      warga = await prisma.user.update({
        where: {
          id: idParam,
          statusVerifikasi: false,
        },
        data: {
          statusVerifikasi: true,
        },
      });
    } else if (status === "Tolak") {
      warga = await prisma.user.update({
        where: {
          id: idParam,
          statusVerifikasi: false,
        },
        data: {
          rejectionReason: alasan,
        },
      });
    } else if (status === "Batal") {
      warga = await prisma.user.update({
        where: {
          id: idParam,
          statusVerifikasi: false,
        },
        data: {
          rejectionReason: null,
        },
      });
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_STATUS_VERIF",
        message: "Berhasil mengubah data verif warga",
        data: warga,
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
    const rateLimit = await adminRateLimit.limit(identifier);

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

    if (role !== "admin") {
      return NextResponse.json(
        {
          status: 403,
          code: "FORBIDEN",
          message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          data: null,
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const statusParam = searchParams.get("status");

    const warga = await prisma.user.findMany({
      where: {
        role: "warga",
        statusVerifikasi: false,
        noHP: {
          not: null,
        },
        noRumah: {
          not: null,
        },
        ...(statusParam === "Semua"
          ? {
              rejectionReason: null,
            }
          : {
              rejectionReason: {
                not: null,
              },
            }),
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  noHP: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  noRumah: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        noHP: true,
        noRumah: true,
        createdAt: true,
        statusVerifikasi: true,
        rejectionReason: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_WARGA_VERIF",
        message: "Berhasil mengambil data verif warga",
        data: warga,
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
