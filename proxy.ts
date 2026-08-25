import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Mapping role -> dashboard path
const roleDashboardMap: Record<string, string> = {
  warga: "/warga/dashboard",
  petugas: "/petugas/dashboard",
  warung: "/warung/dashboard",
  admin: "/admin/dashboard",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname === "/auth" || pathname === "/auth/register-email") {
    if (session) {
      const dashboard =
        roleDashboardMap[session.user.role as string] || "/warga/dashboard";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  const protectedPrefixes = ["/warga", "/admin", "/petugas", "/warung"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) return NextResponse.next();

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const exactRolePaths = ["/admin", "/warga", "/petugas", "/warung"];
  if (exactRolePaths.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`${pathname}/dashboard`, request.url),
    );
  }

  if (
    !pathname.startsWith("/complete-profile") &&
    (!session.user.noHP || !session.user.noRumah)
  ) {
    return NextResponse.redirect(
      new URL("/complete-profile", request.url),
    );
  }

  const userRole = session.user.role as string;
  const roleRouteMap: Record<string, string> = {
    warga: "/warga",
    petugas: "/petugas",
    warung: "/warung",
    admin: "/admin",
  };

  const allowedPrefix = roleRouteMap[userRole];
  if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
    const correctDashboard =
      roleDashboardMap[userRole] || "/warga/dashboard";
    return NextResponse.redirect(new URL(correctDashboard, request.url));
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
    "/complete-profile/:path*",
  ],
};
