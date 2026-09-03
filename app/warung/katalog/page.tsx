import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungKatalog from "@/components/views/WarungSections/Katalog/WarungKatalog";
import { requireRole } from "@/lib/session";

export default async function KatalogWarung() {
  const session = await requireRole("warung");

  return (
    <MainLayout user={session.user}>
      <WarungKatalog user={session.user} />
    </MainLayout>
  );
}
