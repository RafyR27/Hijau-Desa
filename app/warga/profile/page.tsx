import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaProfile from "@/components/views/WargaSections/Profile/WargaProfile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileWarga() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");
  if (!session.user.noHP || !session.user.noRumah)
    console.log("belum ada no hp dan no rumah");
  if (session.user.role === "petugas") redirect("/petugas/dashboard");
  if (session.user.role === "warung") redirect("/warung/dashboard");
  if (session.user.role === "admin") redirect("/admin/dashboard");

  return (
    <MainLayout>
      <WargaProfile user={session.user} />
    </MainLayout>
  );
}
