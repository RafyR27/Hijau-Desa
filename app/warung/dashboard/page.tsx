import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungDashboard from "@/components/views/WarungSections/Dashboard/WarungDashboard";
import { requireRole } from "@/lib/session";

export default async function DashboardWarung() {
  const session = await requireRole("warung");

  return (
    <MainLayout user={session.user}>
      <WarungDashboard user={session.user} />
    </MainLayout>
  );
}
