import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { adminRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const formProductSchema = z.object({
  namaProduct: z.string().trim().min(1).min(2),
  hargaPoin: z.number().min(0),
  image: z.string().nullable().optional(),
  isActive: z.boolean(),
});

const formEditProductSchema = z.object({
  id: z.number(),
  namaProduct: z.string().trim().min(1).min(2),
  hargaPoin: z.number().min(0),
  image: z.string().nullable().optional(),
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
        { status: 401 }
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
        { status: 429 }
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
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_GET_PRODUCTS",
        message: "Berhasil mengambil data katalog produk",
        data: products,
      },
      { status: 200 }
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
      { status: 500 }
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
        { status: 401 }
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
        { status: 429 }
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
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = formProductSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak sesuai",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { namaProduct, hargaPoin, image, isActive } = validated.data;

    const newProduct = await prisma.product.create({
      data: {
        namaProduct: String(namaProduct).trim(),
        hargaPoin: Number(hargaPoin),
        image: image || null,
        isActive: Boolean(isActive),
      },
    });

    if(newProduct.isActive){
      await prisma.notification.create({
        data: {
          title: "Produk baru tersedia!",
          description: `${newProduct.namaProduct} kini sudah bisa anda dapatkan! Yuk cek katalog untuk melihat barangnya.`
        }
      })
    }

    return NextResponse.json(
      {
        status: 201,
        code: "SUCCESS_CREATE_PRODUCT",
        message: "Berhasil menambahkan produk baru",
        data: newProduct,
      },
      { status: 201 }
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
      { status: 500 }
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
        { status: 401 }
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
        { status: 429 }
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
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = formEditProductSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: 400,
          code: "INVALID_DATA",
          message: "Data tidak sesuai",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { id, namaProduct, hargaPoin, image, isActive } = validated.data;

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(namaProduct !== undefined ? { namaProduct: String(namaProduct).trim() } : {}),
        ...(hargaPoin !== undefined ? { hargaPoin: Number(hargaPoin) } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    if (updated.isActive) {
      await prisma.notification.create({
        data: {
          title: `${updated.namaProduct} kembali hadir!`,
          description: `${updated.namaProduct} kini sudah bisa anda dapatkan! Yuk cek katalog untuk melihat barangnya.`,
        },
      });
    }

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPDATE_PRODUCT",
        message: "Berhasil memperbarui data produk",
        data: updated,
      },
      { status: 200 }
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
      { status: 500 }
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
        { status: 401 }
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
        { status: 429 }
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
        { status: 403 }
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
          message: "ID produk wajib disertakan.",
          data: null,
        },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_DELETE_PRODUCT",
        message: "Berhasil menghapus produk",
        data: null,
      },
      { status: 200 }
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
          code: "PRODUK_MASIH_DIGUNAKAN",
          message:
            "Produk tidak dapat dihapus karena telah digunakan dalam transaksi penukaran.",
          data: null,
        },
        { status: 409 }
      );
    }

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
