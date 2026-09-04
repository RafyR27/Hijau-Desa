import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminRateLimit } from "@/lib/rate-limit";
import { ReimbursementItem } from "@/types/reimbursement";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
          code: "FORBIDDEN",
          message: "Akses ditolak.",
          data: null,
        },
        { status: 403 },
      );
    }

    const reimbursement = await prisma.reimbursement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        warung: {
          select: {
            id: true,
            name: true,
            noHP: true,
          },
        },
      },
    });

    const data: ReimbursementItem[] = reimbursement.map((item) => ({
      id: item.id,
      ownerId: item.warung.id,
      owner: item.warung.name,
      noHP: item.warung.noHP,
      pointsClaimed: `${item.jumlahPoin.toLocaleString("id-ID")} Poin`,
      amountRupiah: `Rp ${item.jumlahRupiah.toLocaleString("id-ID")}`,
      date: item.createdAt,
      status: item.status,
    }));

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_REIMBURSEMENT",
        message: "Berhasil mengambil data reimburs",
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
          code: "FORBIDDEN",
          message: "Akses ditolak.",
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

    const reimbursement = await prisma.reimbursement.update({
      where: {
        id: Number(idParam),
      },
      data: {
        status: true,
        diprosesOlehId: identifier,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_REIMBURSEMENT",
        message: "Berhasil mengambil mengubah data reimburs",
        data: reimbursement,
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
