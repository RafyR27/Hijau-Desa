import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasNotification from "@/components/views/PetugasSections/Notification/PetugasNotification";
import { requireRole } from "@/lib/session";

export default async function NotificationPetugas() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <PetugasNotification />
    </MainLayout>
  );
}
