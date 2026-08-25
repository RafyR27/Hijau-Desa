import ProfileKeamananSection from "@/components/views/WargaSections/Profile/ProfileKeamanan/ProfileKeamananSection";
import { requireRole } from "@/lib/session";

export default async function ProfileSecurity() {
  const session = await requireRole("warga");

  return <ProfileKeamananSection user={session.user} />;
}
