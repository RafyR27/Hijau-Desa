import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaKatalog from "@/components/views/WargaSections/Katalog/WargaKatalog";
import { requireRole } from "@/lib/session";

export default async function KatalogWarga() {
  const session = await requireRole("warga");

  return (
    <MainLayout user={session.user}>
      <WargaKatalog user={session.user} />
    </MainLayout>
  );
}
