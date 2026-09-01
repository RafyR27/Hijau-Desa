"use client";

import { useState } from "react";
import SettingsItem from "@/components/commons/SettingItem/SettingItem";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SessionUser } from "@/types/user";
import {
  CircleQuestionMark,
  CircleUserRound,
  Clock3,
  Info,
  LockKeyhole,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LogoutDialog from "@/components/commons/LogoutDialog/LogoutDialog";

const ProfileLayout = ({
  user,
}: {
  user?: SessionUser;
}) => {
  const route = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="mx-auto flex flex-col gap-7">
      <div className="flex gap-7 items-center w-full flex-col">
        <div className="flex gap-4 items-center w-full lg:flex-col">
          <Avatar className="w-13 h-13 lg:w-15 lg:h-15">
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
          <div className="space-y-1 lg:text-center">
            <p className="font-bold truncate max-w-65 lg:text-lg">
              {user?.name}
            </p>
            <p className="text-xs truncate max-w-65 lg:text-sm">
              {user?.email}
            </p>
            <p className="text-xs truncate max-w-65 lg:text-sm">{user?.noHP}</p>
          </div>
        </div>

        <Card
          className={cn(
            "w-full overflow-hidden rounded-2xl border-0 bg-amber-500 text-amber-950",
            user?.statusVerifikasi ? "hidden" : "block",
          )}
        >
          <CardContent className="flex items-center gap-4 px-5 md:px-6 md:py-1">
            {/* Icon */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-800/15">
              <Clock3 className="size-5" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-1 text-amber-950">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold leading-tight">
                  Menunggu Verifikasi
                </h3>

                <span className="rounded-full bg-amber-800/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide">
                  Dalam Proses
                </span>
              </div>

              <p className="text-sm leading-5 text-amber-950/75">
                Akun Anda sedang diperiksa oleh pengurus. Anda akan dapat
                menggunakan seluruh fitur setelah proses verifikasi selesai.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn("w-full", user?.statusVerifikasi ? "block" : "hidden")}
        >
          <CardContent className="flex justify-around items-center text-center font-medium text-sm p-4">
            <div>
              Status verifikasi <br />
              <span className="font-semibold text-emerald-500">
                {user?.statusVerifikasi
                  ? "Terverifikasi"
                  : "Belum Terverifikasi"}
              </span>
            </div>
            <Separator orientation="vertical" className="h-10 shrink-0" />
            <div>
              Akun <br />
              <span className="font-semibold text-emerald-500 capitalize">
                {user?.role}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 w-full">
        {/* Account Setting */}
        <div className="space-y-3">
          <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pengaturan Akun
          </p>

          <div className="rounded-xl overflow-hidden">
            <SettingsItem
              icon={<CircleUserRound className="size-5" />}
              title="Edit Profile"
              description="Ubah nama, no hp, dan alamat rumah"
              href={
                route.includes("warga")
                  ? "/warga/profile/edit"
                  : route.includes("petugas")
                    ? "/petugas/profile/edit"
                    : "/admin/profile/edit"
              }
            />

            <Separator />

            <SettingsItem
              icon={<LockKeyhole className="size-5" />}
              title="Keamanan & Sandi"
              description="Ubah kata sandi akun anda"
              href={
                route.includes("warga")
                  ? "/warga/profile/security"
                  : route.includes("petugas")
                    ? "/petugas/profile/security"
                    : "/admin/profile/security"
              }
            />

            <Separator />

            <SettingsItem
              icon={<Clock3 className="size-5" />}
              title="Riwayat Penukaran"
              description="Lihat riwayat transaksi anda"
              href={
                route.includes("warga")
                  ? "/warga/history"
                  : route.includes("petugas")
                    ? "/petugas/history"
                    : "/admin/history"
              }
            />
          </div>
        </div>

        {/* General */}
        <div className="space-y-3">
          <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Umum
          </p>

          <div className="rounded-xl overflow-hidden">
            <SettingsItem
              icon={<Info className="size-5" />}
              title="Tentang Aplikasi"
              description="Informasi versi dan pengembang"
              href={
                route.includes("warga")
                  ? "/about"
                  : route.includes("petugas")
                    ? "/about"
                    : "/about"
              }
            />

            <Separator />

            <SettingsItem
              icon={<CircleQuestionMark className="size-5" />}
              title="Pusat Bantuan"
              description="Bantuan dan pertanyaan umum"
              href={
                route.includes("warga")
                  ? "/help"
                  : route.includes("petugas")
                    ? "/help"
                    : "/help"
              }
            />
          </div>
        </div>

        {/* Other */}
        <div className="space-y-3">
          <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Lainnya
          </p>

          <div className="rounded-xl overflow-hidden">
            <SettingsItem
              onClick={() => setLogoutOpen(true)}
              icon={<LogOut className="size-5 text-destructive" />}
              title="Keluar"
              destructive
            />
          </div>
        </div>
      </div>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
};

export default ProfileLayout;
