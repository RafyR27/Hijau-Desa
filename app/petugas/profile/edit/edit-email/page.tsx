import EditEmailSection from "@/components/views/PetugasSections/Profile/EditEmail/EditEmailSection";
import { requireRole } from "@/lib/session";

export default async function PetugasEditEmailPage() {
  const session = await requireRole("petugas");

  return <EditEmailSection user={session.user} />;
}
