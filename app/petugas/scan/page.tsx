import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasScan from "@/components/views/PetugasSections/Scan/PetugasScan";
import { requireRole } from "@/lib/session";

export default async function ScanPetugasPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const session = await requireRole("petugas");

  const { error } = await searchParams;

  return (
    <MainLayout user={session.user}>
      <PetugasScan params={error} />
    </MainLayout>
  );
}
