import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// In-memory rate limiter store sederhana
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 60;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count += 1;
  return true;
}

function sanitizeInput(input: any): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 100);
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

// PUT /api/service-katalog/[id]
// Payload yang diharapkan (JSON, bersifat opsional / parsial):
// {
//   "name": "string (maksimal 100 karakter)",
//   "hargaPoin": "number (>= 0)"
// }
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const productId = Number(id);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.name !== undefined) {
      const name = sanitizeInput(body.name);
      if (!name) {
        return NextResponse.json({ success: false, error: "Invalid product name" }, { status: 400 });
      }
      updateData.name = name;
    }

    if (body.hargaPoin !== undefined) {
      const hargaPoin = body.hargaPoin;
      if (typeof hargaPoin !== "number" || hargaPoin < 0) {
        return NextResponse.json(
          { success: false, error: "Invalid hargaPoin: must be a non-negative number" },
          { status: 400 }
        );
      }
      updateData.hargaPoin = Number(hargaPoin);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    const response = NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/service-katalog/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit expired. Please try again later." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const productId = Number(id);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    const response = NextResponse.json({ success: true, data: deletedProduct }, { status: 200 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
