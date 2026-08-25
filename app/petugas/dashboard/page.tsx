import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasDashboard from "@/components/views/PetugasSections/Dashboard/PetugasDashboard";
import { requireRole } from "@/lib/session";

export default async function DashboardPetugas() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <PetugasDashboard user={session.user} />
    </MainLayout>
  );
}
