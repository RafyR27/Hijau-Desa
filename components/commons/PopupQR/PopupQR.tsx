"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SessionUser } from "@/types/user";
import { Clock3, QrCode, RefreshCcw } from "lucide-react";

const PopupQRMobileBottomBar = ({ user }: { user?: SessionUser }) => {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={
          <button className="p-3.5 md:p-3 -translate-y-5 md:translate-y-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-center">
            <QrCode className="size-7 md:size-6" strokeWidth={2} />
          </button>
        }
      />
      <DrawerContent className="max-h-[95vh] m-0 rounded-t-2xl rounded-b-none">
        <DrawerHeader className="border-b px-5 py-4">
          <DrawerTitle className="text-center text-base font-bold">
            QR Saya
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center px-5 pb-8 pt-5">
          <p className="max-w-72.5 text-center text-xs leading-5 text-muted-foreground">
            Tunjukkan QR ini ke petugas atau pemilik warung untuk memproses
            setoran atau penukaran.
          </p>

          {/* QR Code */}
          <div className="mt-6 flex h-44 w-44 items-center justify-center rounded-lg border bg-background shadow-sm">
            <img
              src="/qr-code.png"
              alt="QR Transaksi"
              className="h-32 w-32 object-contain"
            />
          </div>

          <div className="mt-5 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <Clock3 className="size-4" />
            <span>01:53</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>Token Aktif</span>
          </div>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Button
              variant="outline"
              className="h-10 w-full rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
              disabled
            >
              <RefreshCcw className="size-4" />
              Generate Ulang QR
            </Button>

            <DrawerClose
              render={
                <Button className="h-10 w-full rounded-full">Tutup</Button>
              }
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const PopupQRMobile = () => {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={<Button className="mt-4 w-36 rounded-full">Scan QR</Button>}
      />
      <DrawerContent className="max-h-[95vh] m-0 rounded-t-2xl rounded-b-none">
        <DrawerHeader className="border-b px-5 py-4">
          <DrawerTitle className="text-center text-base font-bold">
            QR Saya
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center px-5 pb-8 pt-5">
          <p className="max-w-72.5 text-center text-xs leading-5 text-muted-foreground">
            Tunjukkan QR ini ke petugas atau pemilik warung untuk memproses
            setoran atau penukaran.
          </p>

          {/* QR Code */}
          <div className="mt-6 flex h-44 w-44 items-center justify-center rounded-lg border bg-background shadow-sm">
            <img
              src="/qr-code.png"
              alt="QR Transaksi"
              className="h-32 w-32 object-contain"
            />
          </div>

          {/* Timer */}
          <div className="mt-5 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <Clock3 className="size-4" />
            <span>01:53</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>Token Aktif</span>
          </div>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Button
              variant="outline"
              className="h-10 w-full rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
              disabled
            >
              <RefreshCcw className="size-4" />
              Generate Ulang QR
            </Button>

            <DrawerClose
              render={
                <Button className="h-10 w-full rounded-full">Tutup</Button>
              }
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const PopupQRlargeBottomBar = ({ user }: { user?: SessionUser }) => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button className="p-3.5 md:p-3 -translate-y-5 md:translate-y-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-center">
            <QrCode className="size-7 md:size-6" strokeWidth={2} />
          </button>
        }
      />

      <DialogContent className="max-w-sm rounded-2xl p-0">
        <DialogHeader className="relative border-b px-5 py-4">
          <DialogTitle className="text-center text-base font-bold">
            QR Saya
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-5 pb-6">
          <DialogDescription className="mt-4 max-w-72.5 text-center text-xs leading-5">
            Tunjukkan QR ini ke petugas di lokasi bank sampah untuk memproses
            setoran atau penukaran.
          </DialogDescription>

          <div className="mt-6 flex h-44 w-44 items-center justify-center rounded-lg border bg-background shadow-sm">
            <img
              src="/qr-code.png"
              alt="QR Transaksi"
              className="h-32 w-32 object-contain"
            />
          </div>

          <div className="mt-5 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <Clock3 className="size-4" />
            <span>01:53</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>Token Aktif</span>
          </div>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Button
              variant="outline"
              className="h-10 w-full rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
              disabled
            >
              <RefreshCcw className="size-4" />
              Generate Ulang QR
            </Button>

            <DialogClose
              render={
                <Button className="h-10 w-full rounded-full">Tutup</Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PopupQRlarge = () => {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button className="mt-4 w-36 rounded-full">Scan QR</Button>}
      />

      <DialogContent className="max-w-sm rounded-2xl p-0">
        <DialogHeader className="relative border-b px-5 py-4">
          <DialogTitle className="text-center text-base font-bold">
            QR Saya
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-5 pb-6">
          <DialogDescription className="mt-4 max-w-72.5 text-center text-xs leading-5">
            Tunjukkan QR ini ke petugas di lokasi bank sampah untuk memproses
            setoran atau penukaran.
          </DialogDescription>

          <div className="mt-6 flex h-44 w-44 items-center justify-center rounded-lg border bg-background shadow-sm">
            <img
              src="/qr-code.png"
              alt="QR Transaksi"
              className="h-32 w-32 object-contain"
            />
          </div>

          <div className="mt-5 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <Clock3 className="size-4" />
            <span>01:53</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>Token Aktif</span>
          </div>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Button
              variant="outline"
              className="h-10 w-full rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
              disabled
            >
              <RefreshCcw className="size-4" />
              Generate Ulang QR
            </Button>

            <DialogClose
              render={
                <Button className="h-10 w-full rounded-full">Tutup</Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};



export {
  PopupQRMobileBottomBar,
  PopupQRMobile,
  PopupQRlarge,
  PopupQRlargeBottomBar,
};
