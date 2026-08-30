"use client";

import * as React from "react";

import { NavDocuments } from "./NavSection/nav-documents";
import { NavMain } from "./NavSection/nav-main";
import { NavTools } from "./NavSection/nav-tools";
import { NavUser } from "./NavSection/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CommandIcon } from "lucide-react";
import { SIDEBAR_ADMIN } from "./sidebarAdmin.constants";
import { SessionUser } from "@/types/user";
import Image from "next/image";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: SessionUser;
}) {
  const DATA = SIDEBAR_ADMIN;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! space-x-2"
              render={<a href="/admin/dashboard" />}
            >
              <Image src={"/logo.svg"} alt="Hijau Desa" width={100} height={100} className="w-6"/>
              <span className="text-base font-bold text-primary">Hijau Desa</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={DATA?.navMain} />
        <NavDocuments items={DATA?.documents} />
        <NavTools items={DATA?.tools} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
