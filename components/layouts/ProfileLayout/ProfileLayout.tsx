"use client";

import SettingsItem from "@/components/commons/SettingItem/SettingItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types/user";
import {
  CircleQuestionMark,
  CircleUserRound,
  Clock3,
  Info,
  LockKeyhole,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ProfileLayout = ({
  user,
  children,
}: {
  user?: SessionUser;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const route = usePathname();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-7">
      <div className="flex gap-7 items-center w-full lg:w-1/2 flex-col">
        <div className="flex gap-4 items-center w-full lg:flex-col">
          <Avatar className="w-13 h-13 lg:w-15 lg:h-15">
            <AvatarImage
              src={user?.image || "https://github.com/shadcn.png"}
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

        <div className={cn(user?.statusVerifikasi ? "block" : "hidden")}>
          {children}
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
      </div>

      <div className="flex flex-col gap-7 w-full lg:w-1/2 lg:border lg:p-3 lg:rounded-xl">
        {/* Akun */}
        <div className="space-y-3">
          <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Akun
          </p>

          <div className="rounded-xl overflow-hidden">
            <SettingsItem
              icon={<CircleUserRound className="size-5" />}
              title="Profil"
              description="Kelola informasi anda"
              href={
                route.includes("warga")
                  ? "/warga/profile/edit"
                  : route.includes("petugas")
                    ? "/petugas/profile/edit"
                    : "/warung/profile/edit"
              }
            />

            <Separator />

            <SettingsItem
              icon={<LockKeyhole className="size-5" />}
              title="Keamanan"
              description="Password dan keamanan akun"
              href={
                route.includes("warga")
                  ? "/warga/profile/security"
                  : route.includes("petugas")
                    ? "/petugas/profile/security"
                    : "/warung/profile/security"
              }
            />
          </div>
        </div>

        {/* Information */}
        <div className="space-y-3">
          <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Informasi
          </p>

          <div className="rounded-xl overflow-hidden">
            <SettingsItem
              icon={<Info className="size-5" />}
              title="Tentang Hijau Desa"
              description="Informasi tentang aplikasi Hijau Desa"
              href={
                route.includes("warga")
                  ? "/about-hijau-desa"
                  : route.includes("petugas")
                    ? "/about-hijau-desa"
                    : "/about-hijau-desa"
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
              onClick={handleSignOut}
              icon={<LogOut className="size-5 text-destructive" />}
              title="Keluar"
              destructive
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
