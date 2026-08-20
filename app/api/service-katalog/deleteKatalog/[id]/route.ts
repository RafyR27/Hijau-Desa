import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Endpoint: DELETE /api/service-katalog/deleteKatalog/[id]
 * Description: Menghapus data katalog produk berdasarkan ID.
 * URL Parameters:
 *   - id (number): ID produk yang akan dihapus
 * Response Example:
 * {
 *   "success": true,
 *   "message": "Product deleted successfully"
 * }
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
