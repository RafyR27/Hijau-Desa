import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasPenimbangan from "@/components/views/PetugasSections/Penimbangan/PetugasPenimbangan";
import { requireRole } from "@/lib/session";

export default async function PenimbanganPetugasPage() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <PetugasPenimbangan user={session.user} />
    </MainLayout>
  );
}
