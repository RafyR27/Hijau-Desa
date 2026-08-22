"use client";

import CardPoin from "@/components/commons/CardPoin/CardPoin";
import CardRiwayat from "@/components/commons/CardRiwayat/CardRiwayat";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { PopupQRlarge, PopupQRMobile } from "../../../commons/PopupQR/PopupQR";
import { SessionUser } from "@/types/user";

const WargaDashboard = ({ user }: { user?: SessionUser }) => {
  return (
    <div className="w-full min-h-screen flex flex-col gap-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CardPoin />
        <Card>
          <CardContent className="flex flex-col items-center px-6 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-background border">
              <QrCode size={30} strokeWidth={2} />
            </div>

            <h3 className="text-lg font-bold text-foreground">Tampilkan QR</h3>

            <p className="mt-1 max-w-62.5 text-sm leading-5 text-muted-foreground">
              Tekan dan tunjukkan QR ke petugas untuk setor sampah atau tukar
              poin.
            </p>

            <div className="hidden md:block">
              <PopupQRlarge />
            </div>

            <div className="block md:hidden">
              <PopupQRMobile />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h3 className="font-bold text-[1.1rem]">Riwayat Terbaru</h3>
          <Link
            href="/warga/riwayat"
            className="text-primary hover:underline-offset-2 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <CardRiwayat
            title="Setor Sampah Plastik & Botol Plastik"
            date="12 Jan 2026 | 14.00 WIB"
            poin="+22"
          />
          <CardRiwayat
            title="Tukar Beras 5Kg"
            date="12 Jan 2026 | 15.00 WIB"
            poin="-150"
          />
        </div>
      </div>
    </div>
  );
};

export default WargaDashboard;
