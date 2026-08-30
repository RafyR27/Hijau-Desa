import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminRateLimit } from "@/lib/rate-limit";
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

    const konfigurasi = await prisma.konfigurasi.findFirst();

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_REIMBURSEMENT",
        message: "Berhasil mengambil data reimburs",
        data: konfigurasi,
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

    const body = await req.json();

    if (
      !Number.isInteger(body.ratePoinKeRupiah) ||
      body.ratePoinKeRupiah <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak sesuai.",
          data: null,
        },
        { status: 400 },
      );
    }

    const konfigurasi = await prisma.konfigurasi.update({
      where: {
        id: Number(idParam),
      },
      data: {
        ratePoinKeRupiah: body.ratePoinKeRupiah,
      },
    });

    if (konfigurasi) {
      await prisma.notification.create({
        data: {
          title: "Nilai konversi poin diperbarui",
          description: `Nilai konversi poin telah diperbarui menjadi Rp ${body.ratePoinKeRupiah.toLocaleString(
            "id-ID",
          )} untuk setiap 1 poin. Untuk mitra warung perubahan ini berlaku untuk pengajuan pencairan dana berikutnya.`,
        },
      });
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_KONFIGURASI",
        message: "Berhasil mengubah konfigurasi.",
        data: konfigurasi,
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
