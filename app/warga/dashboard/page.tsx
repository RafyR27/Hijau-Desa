import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaDashboard from "@/components/views/WargaSections/Dashboard/WargaDashboard";
import { requireRole } from "@/lib/session";

export default async function DashboardWarga() {
  const session = await requireRole("warga");

  return (
    <MainLayout user={session.user}>
      <WargaDashboard user={session.user} />
    </MainLayout>
  );
}
