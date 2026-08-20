import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// In-memory simple rate limiter store
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

// GET /api/service-katalog?search=...
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawSearch = searchParams.get("search") || "";
    const search = sanitizeInput(rawSearch);

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: { id: "asc" },
    });

    const response = NextResponse.json({ success: true, data: products }, { status: 200 });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/service-katalog
// Payload yang diharapkan (JSON):
// {
//   "name": "string (maksimal 100 karakter, wajib diisi)",
//   "hargaPoin": "number (bilangan bulat/pecahan >= 0, wajib diisi)"
// }
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawName = body.name;
    const hargaPoin = body.hargaPoin;

    const name = sanitizeInput(rawName);

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing product name (max 100 chars)" },
        { status: 400 }
      );
    }

    if (hargaPoin === undefined || typeof hargaPoin !== "number" || hargaPoin < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid hargaPoin: must be a non-negative number" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        hargaPoin: Number(hargaPoin),
      },
    });

    const response = NextResponse.json({ success: true, data: newProduct }, { status: 201 });
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
