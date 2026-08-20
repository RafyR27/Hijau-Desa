import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/service-katalog - getKatalog & getKatalogBySearch
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const products = await prisma.product.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/service-katalog - postKatalog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, hargaPoin } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing product name" },
        { status: 400 }
      );
    }

    if (hargaPoin === undefined || typeof hargaPoin !== "number" || hargaPoin < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing hargaPoin (must be >= 0)" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        hargaPoin,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
