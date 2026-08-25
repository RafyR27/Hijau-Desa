import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaRiwayat from "@/components/views/WargaSections/Riwayat/WargaRiwayat";
import { requireRole } from "@/lib/session";

export default async function RiwayatWarga() {
  const session = await requireRole("warga");

  return (
    <MainLayout user={session.user}>
      <WargaRiwayat/>
    </MainLayout>
  );
}
