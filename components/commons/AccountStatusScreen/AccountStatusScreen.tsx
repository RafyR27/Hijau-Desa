"use client";

import { useState } from "react";
import { LogOut} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutDialog from "@/components/commons/LogoutDialog/LogoutDialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionUser } from "@/types/user";

export type AccountStatusType = "banned" | "rejected";

export interface AccountStatusScreenProps {
  /**
  @default "banned"
   */
  type?: AccountStatusType;
  title?: string;
  description?: string;
  userName?: string;
  userEmail?: string;
  className?: string;
  user?: SessionUser;
}

export default function AccountStatusScreen({
  type = "banned",
  title,
  description,
  className,
  user,
}: AccountStatusScreenProps) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isBanned = type === "banned";

  const defaultTitle = isBanned
    ? "Akses Akun Ditangguhkan"
    : "Verifikasi Akun Ditolak";

  const defaultDescription = isBanned
    ? "Akun Anda telah dinonaktifkan oleh pengurus karena melanggar syarat & ketentuan atau terindikasi adanya aktivitas yang tidak wajar."
    : "Pengajuan verifikasi akun Anda tidak dapat disetujui. Silakan hubungi pengurus untuk info lebih lanjut.";

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-between md:justify-center md:gap-20 p-5",
        className,
      )}
    >
      <div className="space-y-6 text-center max-w-lg py-10">
        {/* avatar Icon */}
        <div className="flex flex-col justify-center items-center">
          <Avatar className="size-20">
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
          {/* User Details Pill */}
          <div className="p-3 text-center">
            <p className="font-semibold text-foreground truncate max-w-50">
              {user?.name}
            </p>
            <p className="truncate max-w-50">{user?.email}</p>
          </div>
        </div>

        {/* Badge & Title */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {title || defaultTitle}
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            {description || defaultDescription}
          </p>
        </div>
      </div>

      <div className="max-w-lg w-full space-y-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setLogoutOpen(true)}
          className="w-full rounded-2xl h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2 font-medium cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Keluar dari Akun</span>
        </Button>
      </div>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}
