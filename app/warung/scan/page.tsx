import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import WarungScan from "@/components/views/WarungSections/Scan/WarungScan";
import { requireRole } from "@/lib/session";

export default async function ScanWarungPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const session = await requireRole("warung");

  const { error } = await searchParams;

  return (
    <MainLayout user={session.user}>
      <WarungScan params={error} />
    </MainLayout>
  );
}
