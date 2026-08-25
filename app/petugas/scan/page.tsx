import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasScan from "@/components/views/PetugasSections/Scan/PetugasScan";
import { requireRole } from "@/lib/session";

export default async function ScanPetugasPage() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <PetugasScan user={session.user} />
    </MainLayout>
  );
}
