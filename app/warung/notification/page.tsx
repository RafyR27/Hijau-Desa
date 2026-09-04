import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungNotification from "@/components/views/WarungSections/Notification/WarungNotification";
import { requireRole } from "@/lib/session";

export default async function NotificationWarung() {
  const session = await requireRole("warung");

  return (
    <MainLayout user={session.user}>
      <WarungNotification />
    </MainLayout>
  );
}
