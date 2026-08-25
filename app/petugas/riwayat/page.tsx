import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasRiwayat from "@/components/views/PetugasSections/Riwayat/PetugasRiwayat";
import { requireRole } from "@/lib/session";

export default async function RiwayatPetugas() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <PetugasRiwayat />
    </MainLayout>
  );
}
