import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SettingsView from "@/components/views/AdminSections/Settings/Settings";
import { requireRole } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Pengaturan Sistem" />
      <SettingsView />
    </SidebarLayout>
  );
}
