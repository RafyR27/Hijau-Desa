import ProfileEditSection from "@/components/views/PetugasSections/Profile/ProfileEdit/ProfileEditSection";
import { requireRole } from "@/lib/session";

export default async function ProfileEditPetugas() {
  const session = await requireRole("petugas");

  return <ProfileEditSection user={session.user} />;
}
