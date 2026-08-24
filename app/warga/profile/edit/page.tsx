import ProfileEditSection from "@/components/views/WargaSections/Profile/ProfileEdit/ProfileEditSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileEdit() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");
  if (!session.user.noHP || !session.user.noRumah)
    console.log("belum ada no hp dan no rumah");
  if (session.user.role === "petugas") redirect("/petugas/dashboard");
  if (session.user.role === "warung") redirect("/warung/dashboard");
  if (session.user.role === "admin") redirect("/admin/dashboard");

  return <ProfileEditSection user={session.user} />;
}
