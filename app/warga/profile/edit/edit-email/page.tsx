import EditEmailSection from "@/components/views/WargaSections/Profile/EditEmail/EditEmailSection";
import { requireRole } from "@/lib/session";

export default async function WargaEditEmailPage() {
  const session = await requireRole("warga");

  return <EditEmailSection user={session.user} />;
}
