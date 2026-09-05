
import AccountStatusScreen from "@/components/commons/AccountStatusScreen/AccountStatusScreen";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SuspendedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return <AccountStatusScreen type="banned" user={session.user} />;
}
