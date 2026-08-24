import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Endpoint: GET /api/service-katalog/getKatalogBySearch
 * Description: Mencari data katalog produk berdasarkan nama.
 * Query Parameters:
 *   - search (string): Kata kunci pencarian produk (opsional)
 * Request URL Example: /api/service-katalog/getKatalogBySearch?search=pupuk
 * Response Example:
 * {
 *   "success": true,
 *   "data": [
 *     { "id": 1, "name": "Pupuk Organik", "hargaPoin": 50, "createdAt": "...", "updatedAt": "..." }
 *   ]
 * }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const products = await prisma.product.findMany({
      where: search
        ? {
            namaProduct: {
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
