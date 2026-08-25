import ProfileEditSection from "@/components/views/WargaSections/Profile/ProfileEdit/ProfileEditSection";
import { requireRole } from "@/lib/session";

export default async function ProfileEdit() {
  const session = await requireRole("warga");

  return <ProfileEditSection user={session.user} />;
}
