"use client";

import QRScanner from "@/components/commons/QRScanner/QRScanner";
import { SessionUser } from "@/types/user";
import { Info, QrCode } from "lucide-react";
import { useScan } from "./useScan";

const PetugasScan = ({ user }: { user?: SessionUser }) => {
  const { handleScan } = useScan();

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 py-4">
      {/* QR Scanner Component */}
      <div className="w-full">
        <QRScanner onScan={handleScan} />
      </div>

      {/* Info Card / Tips */}
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl border bg-muted/40 p-4 text-xs text-muted-foreground flex items-start gap-3">
        <Info className="size-4.5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Tips Pemindaian</p>
          <p className="leading-relaxed">
            Pastikan pencahayaan cukup dan layar ponsel warga tidak terlalu redup agar pemindaian berjalan cepat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetugasScan;
