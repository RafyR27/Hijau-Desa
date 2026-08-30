import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import AdminDashboardView from "@/components/views/AdminSections/Dashboard/AdminDashboard";
import { requireRole } from "@/lib/session";

export default async function AdminDashboardPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Dashboard Admin" />
      <AdminDashboardView user={session.user} />
    </SidebarLayout>
  );
}
