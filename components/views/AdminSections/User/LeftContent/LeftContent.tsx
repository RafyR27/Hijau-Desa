"use client"

import { UserRound, UserShield } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

const items = [
  {
    name: "Profile",
    url: "/admin/user/profile",
    icon: UserRound,
  },
  {
    name: "Account",
    url: "/admin/user/account",
    icon: UserShield,
  },
];

const LeftContent = () => {
  const pathname = usePathname();

  return (
    <Card className="h-fit p-0">
      <SidebarMenu className="p-2 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <Link href={item.url}>
                <SidebarMenuButton
                  className="cursor-pointer flex gap-2 items-center"
                  isActive={isActive}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </Card>
  );
};

export default LeftContent;
