import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaDashboard from "@/components/views/WargaSections/Dashboard/WargaDashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardWarga() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");
  if (!session.user.noHP || !session.user.noRumah) redirect("/complete-profile");
  if (session.user.role === "petugas") redirect("/petugas/dashboard");
  if (session.user.role === "warung") redirect("/warung/dashboard");
  if (session.user.role === "admin") redirect("/admin/dashboard");

  return (
    <MainLayout user={session.user}>
      <WargaDashboard user={session.user} />
    </MainLayout>
  );
}
