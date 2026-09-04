"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Clock3, QrCode, RefreshCcw } from "lucide-react";
import { useQR } from "./useQR";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface QRBodyProps {
  isLoading: boolean;
  data: { qrImage?: string } | undefined;
  formattedTime: string;
  timeLeft: number;
  onGenerateQR: () => void;
  closeButton: React.ReactNode;
  description?: string;
}

const QRBody = ({
  isLoading,
  data,
  formattedTime,
  timeLeft,
  onGenerateQR,
  closeButton,
  description = "Tunjukkan QR ini ke petugas atau pemilik warung untuk memproses setoran atau penukaran.",
}: QRBodyProps) => {
  const isExpired = timeLeft === 0;

  return (
    <div className="flex flex-col items-center px-5 pb-8 pt-5">
      <p className="max-w-72.5 text-center text-xs leading-5 text-muted-foreground">
        {description}
      </p>

      {/* QR Code Container */}
      <div className="mt-6 flex h-52 w-52 items-center justify-center rounded-xl bg-background overflow-hidden relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner />
            <span className="text-xs text-muted-foreground">Membuat QR...</span>
          </div>
        ) : data?.qrImage ? (
          <div className="relative flex h-full w-full items-center justify-center p-3">
            <Image
              src={data.qrImage}
              alt="QR Transaksi"
              className={cn(
                "h-full w-full object-contain transition-opacity duration-300",
                isExpired && "opacity-20 grayscale",
              )}
              width={160}
              height={160}
            />
            {isExpired && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-background/70 backdrop-blur-[2px]">
                <span className="rounded-full bg-destructive/15 border border-destructive/30 px-3 py-1 text-xs font-semibold text-destructive">
                  QR Kedaluwarsa
                </span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            QR belum tersedia
          </span>
        )}
      </div>

      {/* Countdown Timer */}
      <div
        className={cn(
          "mt-5 flex items-center gap-1.5 rounded-full px-3.5 h-7 text-sm font-semibold transition-colors duration-200",
          isExpired
            ? "bg-destructive/10 text-destructive border border-destructive/20"
            : "bg-primary/10 text-primary border border-primary/20",
        )}
      >
        <Clock3 className="size-4" />
        <span className="font-mono tracking-wider">{formattedTime}</span>
      </div>

      {/* Token status */}
      <div
        className={cn(
          "mt-3 flex items-center gap-1.5 text-[11px] font-medium transition-colors",
          isExpired ? "text-destructive" : "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full transition-colors",
            isExpired ? "bg-destructive animate-pulse" : "bg-primary",
          )}
        />
        <span>{isExpired ? "Token Kedaluwarsa" : "Token Aktif"}</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex w-full flex-col gap-2.5">
        <Button
          variant={isExpired ? "default" : "outline"}
          className={cn(
            "h-10 w-full rounded-full transition-all font-medium",
            isExpired
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md ring-2 ring-primary/20 ring-offset-1"
              : "border-primary text-primary hover:bg-primary/10 hover:text-primary",
          )}
          disabled={isLoading || timeLeft > 0}
          onClick={onGenerateQR}
        >
          {isLoading ? (
            <>
              <Spinner className="size-4 mr-1.5" />
              <span>Membuat QR Baru...</span>
            </>
          ) : (
            <>
              <RefreshCcw className="size-4 mr-1.5" />
              <span>Generate Ulang QR</span>
            </>
          )}
        </Button>

        {closeButton}
      </div>
    </div>
  );
};

const VerifikasiBody = ({ closeButton }: { closeButton: React.ReactNode }) => (
  <div className="flex flex-col items-center px-6 pb-8 pt-6 text-center">
    {/* Ilustrasi */}
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-10 text-amber-500"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>

    <h2 className="text-lg font-bold text-foreground">Upss...</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xs">
      Akun Anda sedang dalam tahap verifikasi. Fitur QR Code akan aktif
      setelah akun Anda terverifikasi oleh RW atau Kepala Desa.
    </p>

    <div className="mt-6 w-full">
      {closeButton}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  BottomBar Popups                                                            */
/* -------------------------------------------------------------------------- */

const PopupQRMobileBottomBar = ({ statusVerifikasi, id }: { statusVerifikasi?: boolean; id?: string }) => {
  const [open, setOpen] = useState(false);
  const { generateQR, data, isLoading, formattedTime, timeLeft } = useQR();

  const handleGenerateQR = () => {
    generateQR(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && statusVerifikasi !== false) {
      generateQR();
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerTrigger
        render={
          <button
            id={id}
            className="p-3.5 md:p-3 -translate-y-5 md:translate-y-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-center transition-transform active:scale-95"
          >
            <QrCode className="size-7 md:size-6" strokeWidth={2} />
          </button>
        }
      />
      <DrawerContent className="max-h-[95vh] m-0 rounded-t-2xl rounded-b-none">
        <DrawerHeader className="border-b px-5 py-4">
          <DrawerTitle className="text-center text-base font-bold">
            {statusVerifikasi === false ? "Verifikasi Akun" : "QR Saya"}
          </DrawerTitle>
        </DrawerHeader>

        {statusVerifikasi === false ? (
          <VerifikasiBody
            closeButton={
              <DrawerClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        ) : (
          <QRBody
            isLoading={isLoading}
            data={data}
            formattedTime={formattedTime}
            timeLeft={timeLeft}
            onGenerateQR={handleGenerateQR}
            closeButton={
              <DrawerClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};

const PopupQRlargeBottomBar = ({ statusVerifikasi, id }: { statusVerifikasi?: boolean; id?: string }) => {
  const [open, setOpen] = useState(false);
  const { generateQR, data, isLoading, formattedTime, timeLeft } = useQR();

  const handleGenerateQR = () => {
    generateQR(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && statusVerifikasi !== false) {
      generateQR();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            id={id}
            className="p-3.5 md:p-3 -translate-y-5 md:translate-y-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-center transition-transform active:scale-95"
          >
            <QrCode className="size-7 md:size-6" strokeWidth={2} />
          </button>
        }
      />

      <DialogContent className="max-w-sm rounded-2xl p-0">
        <DialogHeader className="relative border-b px-5 py-4">
          <DialogTitle className="text-center text-base font-bold">
            {statusVerifikasi === false ? "Verifikasi Akun" : "QR Saya"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {statusVerifikasi === false
              ? "Akun Anda sedang dalam tahap verifikasi."
              : "Tunjukkan QR ini ke petugas di lokasi bank sampah untuk memproses setoran atau penukaran."}
          </DialogDescription>
        </DialogHeader>

        {statusVerifikasi === false ? (
          <VerifikasiBody
            closeButton={
              <DialogClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        ) : (
          <QRBody
            isLoading={isLoading}
            data={data}
            formattedTime={formattedTime}
            timeLeft={timeLeft}
            onGenerateQR={handleGenerateQR}
            description="Tunjukkan QR ini ke petugas di lokasi bank sampah untuk memproses setoran atau penukaran."
            closeButton={
              <DialogClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

/* -------------------------------------------------------------------------- */
/*  Dashboard Popups                                                            */
/* -------------------------------------------------------------------------- */

const PopupQRDashboardLarge = ({
  trigger,
  statusVerifikasi,
}: {
  trigger: React.ReactNode;
  statusVerifikasi?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { generateQR, data, isLoading, formattedTime, timeLeft } = useQR();

  const handleGenerateQR = () => {
    generateQR(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && statusVerifikasi !== false) {
      generateQR();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger as React.ReactElement} />

      <DialogContent className="max-w-sm rounded-2xl p-0">
        <DialogHeader className="relative border-b px-5 py-4">
          <DialogTitle className="text-center text-base font-bold">
            {statusVerifikasi === false ? "Verifikasi Akun" : "QR Saya"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {statusVerifikasi === false
              ? "Akun Anda sedang dalam tahap verifikasi."
              : "Tunjukkan QR ini ke petugas di lokasi bank sampah untuk memproses setoran atau penukaran."}
          </DialogDescription>
        </DialogHeader>

        {statusVerifikasi === false ? (
          <VerifikasiBody
            closeButton={
              <DialogClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        ) : (
          <QRBody
            isLoading={isLoading}
            data={data}
            formattedTime={formattedTime}
            timeLeft={timeLeft}
            onGenerateQR={handleGenerateQR}
            description="Tunjukkan QR ini ke petugas di lokasi bank sampah untuk memproses setoran atau penukaran."
            closeButton={
              <DialogClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const PopupQRDashboardMobile = ({
  trigger,
  statusVerifikasi,
}: {
  trigger: React.ReactNode;
  statusVerifikasi?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { generateQR, data, isLoading, formattedTime, timeLeft } = useQR();

  const handleGenerateQR = () => {
    generateQR(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && statusVerifikasi !== false) {
      generateQR();
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerTrigger render={trigger as React.ReactElement} />
      <DrawerContent className="max-h-[95vh] m-0 rounded-t-2xl rounded-b-none">
        <DrawerHeader className="border-b px-5 py-4">
          <DrawerTitle className="text-center text-base font-bold">
            {statusVerifikasi === false ? "Verifikasi Akun" : "QR Saya"}
          </DrawerTitle>
        </DrawerHeader>

        {statusVerifikasi === false ? (
          <VerifikasiBody
            closeButton={
              <DrawerClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        ) : (
          <QRBody
            isLoading={isLoading}
            data={data}
            formattedTime={formattedTime}
            timeLeft={timeLeft}
            onGenerateQR={handleGenerateQR}
            closeButton={
              <DrawerClose
                render={
                  <Button className="h-10 w-full rounded-full">Tutup</Button>
                }
              />
            }
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export {
  PopupQRMobileBottomBar,
  PopupQRlargeBottomBar,
  PopupQRDashboardLarge,
  PopupQRDashboardMobile,
};

