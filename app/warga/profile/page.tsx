import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaProfile from "@/components/views/WargaSections/Profile/WargaProfile";
import { requireRole } from "@/lib/session";

export default async function ProfileWarga() {
  const session = await requireRole("warga");

  return (
    <MainLayout user={session.user}>
      <WargaProfile user={session.user} />
    </MainLayout>
  );
}
