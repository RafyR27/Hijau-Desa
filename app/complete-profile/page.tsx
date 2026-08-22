import CompleteProfileSection from "@/components/views/CompleteProfile/CompleteProfileSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CompleteProfile() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (!session) redirect("/auth");
      if (session.user.noHP && session.user.noRumah) redirect("/warga/dashboard");

    return (
      <div className="w-full min-h-screen">
        <div className="px-5 md:px-20 lg:px-40 pt-1">
            <CompleteProfileSection user={session.user} />
        </div>
      </div>
    );
}