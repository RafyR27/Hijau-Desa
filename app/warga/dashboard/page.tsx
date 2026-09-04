import OnboardingTutorial from "@/components/commons/OnBoarding/OnBoardingTutorial";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WargaDashboard from "@/components/views/WargaSections/Dashboard/WargaDashboard";
import { requireRole } from "@/lib/session";

export default async function DashboardWarga() {
  const session = await requireRole("warga");

  return (
    <MainLayout user={session.user}>
      <OnboardingTutorial
        role={session.user.role}
        newAccount={session.user.newAccount}
      />
      <WargaDashboard user={session.user} />
    </MainLayout>
  );
}
