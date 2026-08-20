import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Endpoint: GET /api/service-katalog/getKatalog
 * Description: Mengambil semua data katalog produk.
 * Query Parameters: Tidak ada
 * Response Example:
 * {
 *   "success": true,
 *   "data": [
 *     { "id": 1, "name": "Produk A", "hargaPoin": 100, "createdAt": "...", "updatedAt": "..." }
 *   ]
 * }
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
