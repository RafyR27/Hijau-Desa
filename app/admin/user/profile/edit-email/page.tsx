import EditEmailLayout from "@/components/layouts/ProfileLayout/EditEmailLayout/EditEmailLayout";
import { requireRole } from "@/lib/session";

export default async function AdminEditEmailPage() {
  const session = await requireRole("admin");

  return <EditEmailLayout user={session.user} />;
}
