import ResetPasswordSection from "@/components/views/ResetPassword/ResetPassword";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {

  const { token } = await searchParams;

  if (!token) {
    redirect("/auth");
  }

  return <ResetPasswordSection token={token} />;
}