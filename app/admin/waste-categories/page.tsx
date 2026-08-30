import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import WasteCategoriesView from "@/components/views/AdminSections/WasteCategories/WasteCategories";
import { requireRole } from "@/lib/session";

export default async function WasteCategoriesPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Kategori Sampah" />
      <WasteCategoriesView />
    </SidebarLayout>
  );
}
