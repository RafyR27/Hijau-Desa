import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import VerifikasiWargaView from "@/components/views/AdminSections/VerifikasiWarga/VerifikasiWarga";
import { requireRole } from "@/lib/session";

export default async function VerifikasiWargaPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Verifikasi Warga" />
      <VerifikasiWargaView />
    </SidebarLayout>
  );
}
