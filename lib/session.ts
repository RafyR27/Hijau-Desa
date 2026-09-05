import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Role = "warga" | "petugas" | "warung" | "admin";

export async function getRequiredSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");

  if (session.user.banned) {
    redirect("/suspended");
  }

  if (session.user.rejectionReason) {
    redirect("/rejected");
  }

  return session;
}

export async function requireRole(role: Role) {
  const session = await getRequiredSession();

  if (!session.user.noHP || !session.user.noRumah) {
    redirect("/complete-profile");
  }

  const roleDashboardMap: Record<Role, string> = {
    warga: "/warga/dashboard",
    petugas: "/petugas/dashboard",
    warung: "/warung/dashboard",
    admin: "/admin/dashboard",
  };

  if (session.user.role !== role) {
    const correctDashboard =
      roleDashboardMap[session.user.role as Role] || "/warga/dashboard";
    redirect(correctDashboard);
  }

  return session;
}
