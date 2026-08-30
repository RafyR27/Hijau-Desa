import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import TransactionsView from "@/components/views/AdminSections/Transactions/Transactions";
import { requireRole } from "@/lib/session";

export default async function TransactionsPage() {
  const session = await requireRole("admin");

  return (
    <SidebarLayout user={session.user}>
      <SiteHeader title="Transaksi" />
      <TransactionsView user={session.user} />
    </SidebarLayout>
  );
}
