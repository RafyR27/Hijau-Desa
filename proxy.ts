import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

  if (!session) {
    const isAuthRoute =
      pathname === "/auth" ||
      pathname === "/auth/register-email" ||
      pathname === "/auth/forgot-password" ||
      pathname === "/auth/reset-password";

    if (isAuthRoute) {
      return NextResponse.next();
    }

    const protectedPrefixes = [
      "/warga",
      "/admin",
      "/petugas",
      "/warung",
      "/complete-profile",
      "/suspended",
      "/rejected",
    ];

    const isProtected = protectedPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (isProtected) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
  }

  if (session.user.banned) {
    if (pathname !== "/suspended") {
      return NextResponse.redirect(new URL("/suspended", request.url));
    }
    return NextResponse.next();
  }

  if (session.user.rejectionReason) {
    if (pathname !== "/rejected") {
      return NextResponse.redirect(new URL("/rejected", request.url));
    }
    return NextResponse.next();
  }

  const userRole = (session.user.role as string) || "warga";
  const userDashboard = roleDashboardMap[userRole] || "/warga/dashboard";

  if (pathname === "/suspended" || pathname === "/rejected") {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  const isAuthRoute =
    pathname === "/auth" ||
    pathname === "/auth/register-email" ||
    pathname === "/auth/forgot-password" ||
    pathname === "/auth/reset-password";

  if (isAuthRoute) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  const hasIncompleteProfile = !session.user.noHP || !session.user.noRumah;
  if (hasIncompleteProfile) {
    if (!pathname.startsWith("/complete-profile")) {
      return NextResponse.redirect(new URL("/complete-profile", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/complete-profile")) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  const exactRolePaths = ["/admin", "/warga", "/petugas", "/warung"];
  if (exactRolePaths.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`${pathname}/dashboard`, request.url),
    );
  }

  const roleRouteMap: Record<string, string> = {
    warga: "/warga",
    petugas: "/petugas",
    warung: "/warung",
    admin: "/admin",
  };

  const allowedPrefix = roleRouteMap[userRole];
  const protectedPrefixes = ["/warga", "/admin", "/petugas", "/warung"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && allowedPrefix && !pathname.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
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
    "/suspended/:path*",
    "/rejected/:path*",
  ],
};

