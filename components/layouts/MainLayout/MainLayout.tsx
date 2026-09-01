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
  const isSubPage =
    route.includes("notification") ||
    route.includes("scan") ||
    route.includes("penimbangan");

  const isPetugasPage =
    route.includes("scan") ||
    route.includes("penimbangan");

  return (
    <div className="w-full min-h-screen relative">
      {!isSubPage ? <NavbarMain user={user} /> : <Navbar user={user} />}

      <div className="w-full flex justify-center">
        <div
          className={cn(
            "px-5 pt-1 w-full md:max-w-3xl",
            isPetugasPage ? "pb-3 lg:pb-25" : "pb-25",
          )}
        >
          {children}
        </div>
      </div>

      <div className={cn(isSubPage ? "hidden md:block" : "block")}>
        <BottomBar user={user} />
      </div>
    </div>
  );
}
