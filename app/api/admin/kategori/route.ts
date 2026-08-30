import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { adminRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const formKategoriSchema = z.object({
  namaKategori: z.string().trim().min(1).min(2),
  ratePoinPerKg: z.number().min(0),
  isActive: z.boolean(),
});

const formEditKategoriSchema = z.object({
  id: z.number(),
  namaKategori: z.string().trim().min(1).min(2),
  ratePoinPerKg: z.number().min(0),
  isActive: z.boolean(),
});

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

    const kategori = await prisma.kategoriSampah.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_KATEGORI",
        message: "Berhasil mengambil data kategori sampah",
        data: kategori,
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

    const body = await req.json();
    const validated = formKategoriSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak sesuai",
          errors: validated.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { namaKategori, ratePoinPerKg, isActive } = validated.data;

    if (
      !namaKategori ||
      ratePoinPerKg === undefined ||
      ratePoinPerKg === null
    ) {
      return NextResponse.json(
        {
          status: 400,
          code: "BAD_REQUEST",
          message: "Nama kategori dan tarif poin per kg wajib diisi.",
          data: null,
        },
        { status: 400 },
      );
    }

    const newKategori = await prisma.kategoriSampah.create({
      data: {
        namaKategori: String(namaKategori).trim(),
        ratePoinPerKg: Number(ratePoinPerKg),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        status: 201,
        code: "SUCCESS_CREATE_KATEGORI",
        message: "Berhasil menambahkan kategori sampah baru",
        data: newKategori,
      },
      { status: 201 },
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

    const body = await req.json();
    const validated = formEditKategoriSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak sesuai",
          errors: validated.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { id, namaKategori, ratePoinPerKg, isActive } = validated.data;

    if (!id) {
      return NextResponse.json(
        {
          status: 400,
          code: "BAD_REQUEST",
          message: "ID kategori wajib disertakan.",
          data: null,
        },
        { status: 400 },
      );
    }

    const updated = await prisma.kategoriSampah.update({
      where: { id: Number(id) },
      data: {
        ...(namaKategori !== undefined
          ? { namaKategori: String(namaKategori).trim() }
          : {}),
        ...(ratePoinPerKg !== undefined
          ? { ratePoinPerKg: Number(ratePoinPerKg) }
          : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_KATEGORI",
        message: "Berhasil mengedit kategori sampah",
        data: updated,
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

export async function DELETE(req: Request) {
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

    let id = idParam ? Number(idParam) : null;
    if (!id) {
      const body = await req.json().catch(() => ({}));
      if (body.id) id = Number(body.id);
    }

    if (!id) {
      return NextResponse.json(
        {
          status: 400,
          code: "BAD_REQUEST",
          message: "ID kategori wajib disertakan.",
          data: null,
        },
        { status: 400 },
      );
    }

    await prisma.kategoriSampah.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_DELETE_KATEGORI",
        message: "Berhasil menghapus kategori sampah",
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          status: 409,
          code: "KATEGORI_MASIH_DIGUNAKAN",
          message:
            "Kategori tidak dapat dihapus karena masih digunakan oleh transaksi setor.",
          data: null,
        },
        { status: 409 },
      );
    }

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
