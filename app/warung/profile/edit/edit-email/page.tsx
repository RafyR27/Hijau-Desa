import EditEmailSection from "@/components/views/WarungSections/Profile/EditEmail/EditEmailSection";
import { requireRole } from "@/lib/session";

export default async function WarungEditEmailPage() {
  const session = await requireRole("warung");

  return <EditEmailSection user={session.user} />;
}
