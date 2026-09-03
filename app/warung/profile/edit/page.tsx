import ProfileEditSection from "@/components/views/WarungSections/Profile/ProfileEdit/ProfileEditSection";
import { requireRole } from "@/lib/session";

export default async function ProfileEdit() {
  const session = await requireRole("warung");

  return <ProfileEditSection user={session.user} />;
}
