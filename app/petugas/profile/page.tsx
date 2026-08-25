import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasProfile from "@/components/views/PetugasSections/Profile/PetugasProfile";
import { requireRole } from "@/lib/session";

export default async function ProfilePetugas() {
  const session = await requireRole("petugas");

  return (
    <MainLayout>
      <PetugasProfile user={session.user} />
    </MainLayout>
  );
}
