import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);

  const { pathname } = request.nextUrl;

  // halaman protected
  const protectedRoutes = ["/warga", "/admin", "/petugas", "/warung"];

  if (pathname === "/auth" || pathname === "/auth/register-email") {
    if (session) {
      return NextResponse.redirect(new URL("/warga/dashboard", request.url));
    }
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/auth", request.url);

    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && session) {
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (pathname === "/warga") {
      return NextResponse.redirect(new URL("/warga/dashboard", request.url));
    }

    if (pathname === "/petugas") {
      return NextResponse.redirect(new URL("/petugas/dashboard", request.url));
    }

    if (pathname === "/warung") {
      return NextResponse.redirect(new URL("/warung/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/warga/:path*",
    "/petugas/:path*",
    "/warung/:path*",
  ],
};
