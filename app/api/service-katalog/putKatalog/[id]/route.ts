import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT /api/service-katalog/putKatalog/[id]
export async function PUT(
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

    const body = await request.json();
    const { name, hargaPoin } = body;

    const updateData: any = {};
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json(
          { success: false, error: "Invalid product name" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (hargaPoin !== undefined) {
      if (typeof hargaPoin !== "number" || hargaPoin < 0) {
        return NextResponse.json(
          { success: false, error: "Invalid hargaPoin (must be >= 0)" },
          { status: 400 }
        );
      }
      updateData.hargaPoin = hargaPoin;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
