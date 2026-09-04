import ProfileKeamananSection from "@/components/views/WarungSections/Profile/ProfileKeamanan/ProfileKeamananSection";
import { requireRole } from "@/lib/session";

export default async function ProfileSecurity() {
  const session = await requireRole("warung");

  return <ProfileKeamananSection user={session.user} />;
}
