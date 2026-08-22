"use client";

import {
  BottomBar,
  Navbar,
  NavbarMain,
} from "@/components/commons/Navigation/Navigation";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types/user";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: SessionUser;
}) {
  const route = usePathname();

  return (
    <div className="w-full min-h-screen relative">
      {!route.includes("notification") ? (
        <NavbarMain user={user} />
      ) : (
        <Navbar user={user} />
      )}

      <div className="w-full flex justify-center">
        <div className="px-5 pt-1 mb-30 w-full md:max-w-7xl">{children}</div>
      </div>

      <div
        className={cn(
          route.includes("notification") ? "hidden md:block" : "block",
        )}
      >
        <BottomBar user={user} />
      </div>
    </div>
  );
}
