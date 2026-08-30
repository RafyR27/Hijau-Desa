import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import ProductCatalogView from "@/components/views/AdminSections/ProductCatalog/ProductCatalog";
import { requireRole } from "@/lib/session";

export default async function ProductCatalogPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Katalog Produk" />
      <ProductCatalogView />
    </SidebarLayout>
  );
}
