import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaRiwayat from "@/components/views/WargaSections/Riwayat/WargaRiwayat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RiwayatWarga() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");
  if (!session.user.noHP || !session.user.noRumah)
    redirect("/complete-profile");
  if (session.user.role === "petugas") redirect("/petugas/dashboard");
  if (session.user.role === "warung") redirect("/warung/dashboard");
  if (session.user.role === "admin") redirect("/admin/dashboard");

  return (
    <MainLayout user={session.user}>
      <WargaRiwayat user={session.user} />
    </MainLayout>
  );
}
