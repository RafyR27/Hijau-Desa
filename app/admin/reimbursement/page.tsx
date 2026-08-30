import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import ReimbursementView from "@/components/views/AdminSections/Reimbursement/Reimbursement";
import { requireRole } from "@/lib/session";

export default async function ReimbursementPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Pencairan Dana" />
      <ReimbursementView />
    </SidebarLayout>
  );
}
