import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaNotification from "@/components/views/WargaSections/Notification/WargaNotification";
import { requireRole } from "@/lib/session";

export default async function NotificationWarga() {
  const session = await requireRole("warga");

  return (
    <MainLayout user={session.user}>
      <WargaNotification/>
    </MainLayout>
  );
}
