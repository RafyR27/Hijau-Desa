"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import instance from "@/lib/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Banknote,
  CircleStar,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CairkanDanaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saldoPoin: number;
  saldoRupiah: number;
  ratePoinKeRupiah: number;
}

const CairkanDanaDialog = ({
  open,
  onOpenChange,
  saldoPoin,
  saldoRupiah,
  ratePoinKeRupiah,
}: CairkanDanaDialogProps) => {
  const queryClient = useQueryClient();
  const [jumlahPoin, setJumlahPoin] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Reset saat modal dibuka/ditutup
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJumlahPoin("");
      setError("");
    }
  }, [open]);

  const parsedPoin = parseInt(jumlahPoin.replace(/\D/g, ""), 10);
  const isValidPoin = !isNaN(parsedPoin) && parsedPoin > 0;
  const estimasiRupiah = isValidPoin ? parsedPoin * ratePoinKeRupiah : 0;
  const melebihiSaldo = isValidPoin && parsedPoin > saldoPoin;
  const minSaldo = isValidPoin && parsedPoin * ratePoinKeRupiah < 50000;

  const handleCairkanSemua = () => {
    setJumlahPoin(saldoPoin.toString());
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setJumlahPoin(val);
    if (parseInt(val, 10) > saldoPoin) {
      setError("Jumlah poin melebihi saldo tersedia.");
    } else {
      setError("");
    }
  };

  const cairkanDana = async () => {
    const response = await instance.post("/warung/reimbursement", {
      jumlahPoin: parsedPoin,
    });
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: cairkanDana,
    onSuccess: () => {
      toast.success("Pengajuan pencairan dana berhasil dikirim!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["warung-dashboard"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      const message =
        (err as unknown as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ||
        err?.message ||
        "Gagal mengajukan pencairan dana.";
      toast.error(message, { position: "top-right" });
    },
  });

  const handleSubmit = () => {
    if (!isValidPoin) {
      setError("Masukkan jumlah poin yang ingin dicairkan.");
      return;
    }
    if (melebihiSaldo) {
      setError("Jumlah poin melebihi saldo tersedia.");
      return;
    }
    if (minSaldo) {
      setError("Jumlah poin yang ingin dicairkan harus lebih dari Rp. 50.000");
      return;
    }
    mutate();
  };

  const isDisabled = isPending || !isValidPoin || melebihiSaldo || saldoPoin <= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="size-5 text-primary" />
            Cairkan Dana
          </DialogTitle>
          <DialogDescription>
            Ajukan pencairan saldo poin kamu menjadi Rupiah. Datang ke petugas atau Kepala Desa untuk mengambil dana anda.
          </DialogDescription>
        </DialogHeader>

        {/* Saldo Info */}
        <div className="flex flex-col gap-2.5 rounded-xl bg-primary/8 p-4 border border-primary/15">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleStar className="size-4 text-primary" />
              <span>Saldo Poin</span>
            </div>
            <span className="font-bold text-foreground">
              {saldoPoin.toLocaleString("id-ID")} poin
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="size-4 text-primary" />
              <span>Estimasi Saldo Rupiah</span>
            </div>
            <span className="font-bold text-foreground">
              Rp {saldoRupiah.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Rate Konversi
            </span>
            <span className="text-muted-foreground font-medium">
              1 poin = Rp {ratePoinKeRupiah.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Input Poin */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="jumlah-poin-input"
              className="text-sm font-medium text-foreground"
            >
              Jumlah Poin yang Dicairkan
            </label>
            <button
              type="button"
              onClick={handleCairkanSemua}
              className="text-xs text-primary font-semibold hover:underline active:scale-95 transition-transform"
              disabled={isPending || saldoPoin <= 0}
            >
              Cairkan Semua
            </button>
          </div>
          <div className="relative">
            <CircleStar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="jumlah-poin-input"
              type="text"
              inputMode="numeric"
              value={jumlahPoin}
              onChange={handleInputChange}
              placeholder="Masukkan jumlah poin..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              disabled={isPending}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-1.5 text-destructive text-xs">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Estimasi hasil pencairan */}
          {isValidPoin && !melebihiSaldo && (
            <div className="flex items-center justify-between text-sm rounded-xl bg-green-500/8 border border-green-500/20 px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="size-4 text-green-600" />
                <span>Kamu akan menerima</span>
              </div>
              <span className="font-bold text-green-600">
                Rp {estimasiRupiah.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        {/* Info Note */}
        {saldoPoin <= 0 && (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-700 dark:text-amber-300">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="text-xs">
              Saldo poin kamu masih 0. Lakukan transaksi penukaran barang dengan warga
              terlebih dahulu untuk mengumpulkan poin.
            </p>
          </div>
        )}

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="cursor-pointer"
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            id="btn-submit-cairkan-dana"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full md:w-40"
          >
            {isPending ? <Spinner /> : "Ajukan Pencairan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CairkanDanaDialog;
