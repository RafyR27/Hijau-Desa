import OnboardingTutorial from "@/components/commons/OnBoarding/OnBoardingTutorial";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasDashboard from "@/components/views/PetugasSections/Dashboard/PetugasDashboard";
import { requireRole } from "@/lib/session";

export default async function DashboardPetugas() {
  const session = await requireRole("petugas");

  return (
    <MainLayout user={session.user}>
      <OnboardingTutorial
        role={session.user.role}
        newAccount={session.user.newAccount}
      />
      <PetugasDashboard user={session.user} />
    </MainLayout>
  );
}
