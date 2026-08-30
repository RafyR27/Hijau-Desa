
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../common/SideBar/app-sidebar";
import { SessionUser } from "@/types/user";

export default function SidebarLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user?: SessionUser
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
