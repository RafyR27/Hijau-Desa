"use client";

import { Button } from "@/components/ui/button";
import { SessionUser } from "@/types/user";
import { CircleStar, QrCode, ScanLine } from "lucide-react";
import {
  PopupQRDashboardLarge,
  PopupQRDashboardMobile,
} from "../PopupQR/PopupQR";
import { formatDate } from "@/lib/formated";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const qrButtonTrigger = (
  <Button className="w-full sm:w-auto gap-2.5 rounded-xl bg-background text-primary hover:bg-background/90 hover:text-primary font-semibold shadow-sm h-11 px-6 active:scale-95 transition-all">
    <QrCode className="size-5" />
    <span>Tampilkan QR</span>
  </Button>
);

function CardPoin({ user, saldo }: { user?: SessionUser; saldo: number }) {
  const today = formatDate();
  const path = usePathname();

  return (
    <>
      <div
        className={cn(
          "rounded-2xl bg-primary text-primary-foreground p-6 md:p-8 gap-6 shadow-sm",
          path.includes("warga") || path.includes("warung")
            ? "flex flex-col"
            : "hidden",
        )}
      >
        {/* Top bar: Date & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
              {today}
            </p>
            <h1 className="text-xl md:text-2xl font-bold mt-1 tracking-tight truncate">
              Halo, {user?.name}
            </h1>
          </div>
        </div>

        {/* Bottom bar: Point Balance & Single QR Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <span className="text-xs text-primary-foreground/75 block">
              Total Saldo Poin
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <CircleStar
                className="size-7 md:size-8 text-primary-foreground shrink-0"
                strokeWidth={1.8}
              />
              <span className="text-3xl md:text-4xl font-bold tracking-tight">
                {saldo ? saldo?.toLocaleString("id-ID") : 0}
              </span>
              <span className="text-sm text-primary-foreground/75 font-medium">
                poin
              </span>
            </div>
          </div>

          {/* Single Primary QR CTA */}
          <div
            className={cn(
              "w-full sm:w-auto",
              path.includes("dashboard") ? "block" : "hidden",
            )}
          >
            <div className="hidden md:block">
              <PopupQRDashboardLarge
                trigger={qrButtonTrigger}
                statusVerifikasi={user?.statusVerifikasi}
              />
            </div>
            <div className="block md:hidden">
              <PopupQRDashboardMobile
                trigger={qrButtonTrigger}
                statusVerifikasi={user?.statusVerifikasi}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CardPetugas({ user }: { user?: SessionUser }) {
  const today = formatDate();
  const path = usePathname();

  return (
    <>
      <div className="rounded-2xl bg-primary text-primary-foreground flex flex-col p-6 md:p-8 gap-6 shadow-sm">
        {/* Top bar: Date & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
              {today}
            </p>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
              Halo, Petugas {user?.name}
            </h1>
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
              Selamat bertugas.
            </p>
          </div>
        </div>

        {/* Bottom bar: Point Balance & Single QR Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div
            className={cn(
              "w-full sm:w-auto",
              path.includes("dashboard") ? "block" : "hidden",
            )}
          >
            <Button className="w-full sm:w-auto gap-2.5 rounded-xl bg-background text-primary hover:bg-background/90 hover:text-primary font-semibold shadow-sm h-11 px-6 active:scale-95 transition-all" render={<Link href={"/petugas/scan"} />} nativeButton={false}>
              <ScanLine className="size-5" />
              <span>Scan QR</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export {
  CardPoin,
  CardPetugas,
};
