"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PopupQRlargeBottomBar,
  PopupQRMobileBottomBar,
} from "@/components/commons/PopupQR/PopupQR";
import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  Bell,
  History,
  House,
  Package,
  ScanLine,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/types/user";

const NavbarMain = ({ user }: { user?: SessionUser }) => {
  const route = usePathname();

  return (
    <div className="flex w-full items-center px-5 py-4 lg:px-20">
      <Image
        src="/logo-name-nobg.svg"
        alt="Hijau Desa"
        width={110}
        height={100}
        className="hidden md:block"
      />

      <div className="flex items-center justify-between w-full md:ml-auto md:justify-end gap-3">
        <Image
          src="/logo-name-nobg.svg"
          alt="Hijau Desa"
          width={110}
          height={100}
          className="block md:hidden"
        />

        <div className="flex items-center gap-4">
          <Avatar
            size="default"
            className={cn(route.includes("profile") && "hidden")}
          >
            <AvatarImage
              src={user?.image || "https://github.com/shadcn.png"}
              alt={user?.name || "User"}
            />
            <AvatarFallback>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "CN"}
            </AvatarFallback>
          </Avatar>

          <Link
            href={
              route.includes("warga")
                ? "/warga/notification"
                : route.includes("petugas")
                  ? "/petugas/notification"
                  : "/warung/notification"
            }
            className="rounded-full p-2 hover:bg-accent active:scale-90 transition-transform"
          >
            <Bell size={22} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ user }: { user?: SessionUser }) => {
  const route = usePathname();

  return (
    <div className="w-full h-auto px-5 py-4 lg:px-20 flex justify-between items-center">
      <Link
        href={
          route.includes("warga")
            ? "/warga/dashboard"
            : route.includes("petugas")
              ? "/petugas/dashboard"
              : "/warung/dashboard"
        }
        className="p-2 hover:bg-accent rounded-full md:hidden active:scale-90 transition-transform"
      >
        <ArrowLeft size={25} />
      </Link>

      <Image
        src="/logo-name-nobg.svg"
        alt="Hijau Desa"
        width={110}
        height={100}
      />

      <Avatar size="default">
        <AvatarImage
          src={user?.image || "https://github.com/shadcn.png"}
          alt={user?.name || "User"}
        />
        <AvatarFallback>
          {user?.name ? user.name.substring(0, 2).toUpperCase() : "CN"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

const BottomBar = ({ user }: { user?: SessionUser }) => {
  const route = usePathname();

  return (
    <div className="fixed bottom-0 md:bottom-5 left-0 z-50 w-full ">
      <div className="mx-auto flex full md:max-w-md items-center justify-between border-t md:border md:rounded-2xl bg-background px-4 py-1.5 md:py-1 md:justify-around">
        {/* Beranda */}
        <Link
          href={
            route.includes("warga")
              ? "/warga/dashboard"
              : route.includes("petugas")
                ? "/petugas/dashboard"
                : "/warung/dashboard"
          }
          className={cn(
            "flex flex-col items-center justify-center gap-1 md:gap-0 rounded-xl h-15 md:h-12.5 w-15 text-[0.8rem] transition active:scale-90",
            route.includes("dashboard")
              ? "bg-accent text-primary hover:bg-accent/80 font-bold"
              : "hover:bg-accent hover:text-primary text-muted-foreground",
          )}
        >
          <House className="size-6 md:size-5" strokeWidth={2} />
          <span>Beranda</span>
        </Link>

        {/* Riwayat */}
        <Link
          href={
            route.includes("warga")
              ? "/warga/riwayat"
              : route.includes("petugas")
                ? "/petugas/riwayat"
                : "/warung/riwayat"
          }
          className={cn(
            "flex flex-col items-center justify-center gap-1 md:gap-0 rounded-xl h-15 md:h-12.5 w-15 text-[0.8rem] transition active:scale-90",
            route.includes("riwayat")
              ? "bg-accent text-primary hover:bg-accent/80 font-bold"
              : "hover:bg-accent hover:text-primary text-muted-foreground",
          )}
        >
          <History className="size-6 md:size-5" strokeWidth={2} />
          <span>Riwayat</span>
        </Link>

        {/* QR Code */}
        {route.includes("petugas") || user?.role === "petugas" ? (
          <Link
            href="/petugas/scan"
            className="p-3.5 md:p-3 -translate-y-5 md:translate-y-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-center transition-transform active:scale-95 flex items-center justify-center"
          >
            <ScanLine className="size-7 md:size-6" strokeWidth={2} />
          </Link>
        ) : (
          <>
            <div className="hidden md:block">
              <PopupQRlargeBottomBar
                statusVerifikasi={user?.statusVerifikasi}
              />
            </div>

            <div className="block md:hidden">
              <PopupQRMobileBottomBar
                statusVerifikasi={user?.statusVerifikasi}
              />
            </div>
          </>
        )}

        {/* Katalog */}
        <Link
          href={
            route.includes("warga")
              ? "/warga/katalog"
              : route.includes("petugas")
                ? "/petugas/katalog"
                : "/warung/katalog"
          }
          className={cn(
            "flex flex-col items-center justify-center gap-1 md:gap-0 rounded-xl h-15 md:h-12.5 w-15 text-[0.8rem] transition active:scale-90",
            route.includes("katalog")
              ? "bg-accent text-primary hover:bg-accent/80 font-bold"
              : "hover:bg-accent hover:text-primary text-muted-foreground",
          )}
        >
          <Package className="size-6 md:size-5" strokeWidth={2} />
          <span>Katalog</span>
        </Link>

        {/* Profil */}
        <Link
          href={
            route.includes("warga")
              ? "/warga/profile"
              : route.includes("petugas")
                ? "/petugas/profile"
                : "/warung/profile"
          }
          className={cn(
            "flex flex-col items-center justify-center gap-1 md:gap-0 rounded-xl h-15 md:h-12.5 w-15 text-[0.8rem] transition active:scale-90",
            route.includes("profile")
              ? "bg-accent text-primary hover:bg-accent/80 font-bold"
              : "hover:bg-accent hover:text-primary text-muted-foreground",
          )}
        >
          <UserRound className="size-6 md:size-5" strokeWidth={2} />
          <span>Profil</span>
        </Link>
      </div>
    </div>
  );
};

const NavbarProfile = () => {
  const route = usePathname();

  return (
    <div className="w-full h-auto px-5 py-4 lg:px-20 flex justify-between items-center">
      <Link
        href={
          route.includes("warga")
            ? "/warga/profile"
            : route.includes("petugas")
              ? "/petugas/profile"
              : "/warung/profile"
        }
        className="p-2 hover:bg-accent rounded-full flex gap-3 font-medium active:scale-95 transition-transform"
      >
        <ArrowLeft className="size-6" />
        Kembali
      </Link>
    </div>
  );
};

export { NavbarMain, Navbar, BottomBar, NavbarProfile };
export type { SessionUser };
