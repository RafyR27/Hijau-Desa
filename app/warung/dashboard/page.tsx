import OnboardingTutorial from "@/components/commons/OnBoarding/OnBoardingTutorial";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungDashboard from "@/components/views/WarungSections/Dashboard/WarungDashboard";
import { requireRole } from "@/lib/session";

export default async function DashboardWarung() {
  const session = await requireRole("warung");

  return (
    <MainLayout user={session.user}>
      <OnboardingTutorial
        role={session.user.role}
        newAccount={session.user.newAccount}
      />
      <WarungDashboard user={session.user} />
    </MainLayout>
  );
}
