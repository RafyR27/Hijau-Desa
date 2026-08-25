import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasKatalog from "@/components/views/PetugasSections/Katalog/PetugasKatalog";
import { requireRole } from "@/lib/session";

export default async function KatalogPetugasPage() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <PetugasKatalog user={session.user} />
    </MainLayout>
  );
}
