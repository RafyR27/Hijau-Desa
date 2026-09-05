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
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { useIsMobile } from "@/hooks/use-mobile";

const NavbarMain = ({ user }: { user?: SessionUser }) => {
  const route = usePathname();

  const { data: notifications } = useQuery({
    queryKey: ["notification-navbar"],
    queryFn: async () => {
      const res = await instance.get(
        `/general/notification?status=${"navbar"}`,
      );
      return res.data.data;
    },
  });

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
              src={
                user?.image ||
                "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_3_ytpno7.png"
              }
              alt={user?.name || "User"}
            />
            <AvatarFallback>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "CN"}
            </AvatarFallback>
          </Avatar>

          <Link
            id="notification"
            href={
              route.includes("warga")
                ? "/warga/notification"
                : route.includes("petugas")
                  ? "/petugas/notification"
                  : "/warung/notification"
            }
            className="rounded-full p-2 hover:bg-accent active:scale-90 transition-transform relative"
          >
            {notifications?.hasUnread && (
              <span className="absolute right-0 top-0 size-3 rounded-full bg-blue-400 animate-pulse" />
            )}

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
          src={
            user?.image ||
            "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_3_ytpno7.png"
          }
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
  const isMobile = useIsMobile()

  return (
    <div className="fixed bottom-0 md:bottom-5 left-0 z-50 w-full ">
      <div className="mx-auto flex full md:max-w-md items-center justify-between border-t md:border md:rounded-2xl bg-background px-4 py-1.5 md:py-1 md:justify-around">
        {/* Beranda */}
        <Link
          id="beranda"
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
          id="riwayatBottom"
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
        {route.includes("petugas") ||
        user?.role === "petugas" ||
        route.includes("warung") ||
        user?.role === "warung" ? (
          <Link
            id="qr-button"
            href={user?.role === "petugas" ? "/petugas/scan" : "/warung/scan"}
            className="p-3.5 md:p-3 -translate-y-5 md:translate-y-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-center transition-transform active:scale-95 flex items-center justify-center"
          >
            <ScanLine className="size-7 md:size-6" strokeWidth={2} />
          </Link>
        ) : (
          <>
            <div className="hidden md:block">
              <PopupQRlargeBottomBar
                statusVerifikasi={user?.statusVerifikasi}
                id={!isMobile ? "qr-button" : undefined}
              />
            </div>

            <div className="block md:hidden">
              <PopupQRMobileBottomBar
                statusVerifikasi={user?.statusVerifikasi}
                id={isMobile ? "qr-button" : undefined}
              />
            </div>
          </>
        )}

        {/* Katalog */}
        <Link
          id="katalog"
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
          id="profile"
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

  const getBackLink = () => {
    if (route.includes("/admin/user/profile/edit-email")) {
      return "/admin/user/profile";
    }

    const role = route.includes("warga")
      ? "warga"
      : route.includes("petugas")
        ? "petugas"
        : route.includes("warung")
          ? "warung"
          : "admin";

    if (route.includes("/profile/edit/edit-email")) {
      return `/${role}/profile/edit`;
    }

    return `/${role}/profile`;
  };

  return (
    <div className="w-full h-auto px-5 py-4 lg:px-20 flex justify-between items-center">
      <Link
        href={getBackLink()}
        className="p-2 hover:bg-accent rounded-full flex gap-3 font-medium active:scale-95 transition-transform"
      >
        <ArrowLeft className="size-6" />
        Kembali
      </Link>
    </div>
  );
};

export { NavbarMain, Navbar, BottomBar, NavbarProfile };
