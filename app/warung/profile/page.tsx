import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungProfile from "@/components/views/WarungSections/Profile/WarungProfile";
import { requireRole } from "@/lib/session";

export default async function ProfileWarung() {
  const session = await requireRole("warung");

  return (
    <MainLayout>
      <WarungProfile user={session.user} />
    </MainLayout>
  );
}
