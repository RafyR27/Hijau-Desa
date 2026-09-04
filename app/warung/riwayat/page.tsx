import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungRiwayat from "@/components/views/WarungSections/Riwayat/WarungRiwayat";
import { requireRole } from "@/lib/session";

export default async function RiwayatWarung() {
  const session = await requireRole("warung");

  return (
    <MainLayout user={session.user}>
      <WarungRiwayat />
    </MainLayout>
  );
}
