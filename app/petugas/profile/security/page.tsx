import ProfileKeamananSection from "@/components/views/PetugasSections/Profile/ProfileKeamanan/ProfileKeamananSection";
import { requireRole } from "@/lib/session";

export default async function ProfileSecurityPetugas() {
  const session = await requireRole("petugas");

  return <ProfileKeamananSection user={session.user} />;
}
