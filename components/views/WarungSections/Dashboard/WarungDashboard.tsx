"use client";

import { CardRiwayat } from "@/components/commons/CardRiwayat/CardRiwayat";
import { CardRiwayatSkeleton } from "@/components/commons/CardSkeleton/CardSkeleton";
import Link from "next/link";
import { SessionUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { formatDate } from "@/lib/formated";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Banknote,
  CircleStar,
  Clock3,
  ScanLine,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import CairkanDanaDialog from "./CairkanDanaDialog";

interface WarungDashboardProps {
  user?: SessionUser;
}

interface WarungTransaksiItem {
  id: string;
  type: "penukaran" | "pencairan";
  title: string;
  namaWarga?: string;
  poin: string;
  rupiah: string;
  status?: boolean;
  time: string;
  dateLabel: string;
  createdAt: string;
}

interface WarungDashboardData {
  saldoPoin: number;
  saldoRupiah: number;
  ratePoinKeRupiah: number;
  hasPendingReimbursement: boolean;
  pendingJumlahRupiah: number;
  stats: {
    totalTransaksiPenukaran: number;
    totalPoinTerkumpul: number;
    totalPencairan: number;
  };
  transaksi: WarungTransaksiItem[];
}

const WarungDashboard = ({ user }: WarungDashboardProps) => {
  const today = formatDate();
  const [openCairkanDialog, setOpenCairkanDialog] = useState(false);

  const { data, isLoading } = useQuery<WarungDashboardData>({
    queryKey: ["warung-dashboard"],
    queryFn: async () => {
      const res = await instance.get("/warung/dashboard");
      return res.data.data;
    },
  });

  const saldoPoin = data?.saldoPoin ?? 0;
  const saldoRupiah = data?.saldoRupiah ?? 0;
  const ratePoinKeRupiah = data?.ratePoinKeRupiah ?? 100;
  const hasPending = data?.hasPendingReimbursement ?? false;
  const pendingJumlahRupiah = data?.pendingJumlahRupiah ?? 0;

  return (
    <>
      <div className="w-full mx-auto flex flex-col gap-6 md:gap-8">
        <div className="rounded-2xl bg-primary text-primary-foreground p-6 md:p-8 flex flex-col gap-6 shadow-sm">
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

          {/* Bottom: Saldo & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div className="flex flex-col gap-4">
              {/* Saldo Poin */}
              <div>
                <span className="text-xs text-primary-foreground/75 block">
                  Total Saldo Poin Warung
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  <CircleStar
                    className="size-7 md:size-8 text-primary-foreground shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="text-3xl md:text-4xl font-bold tracking-tight">
                    {isLoading ? 0 : saldoPoin.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-primary-foreground/75 font-medium">
                    poin
                  </span>
                </div>
              </div>

              {/* Estimasi Saldo Rupiah */}
              <div>
                <span className="text-xs text-primary-foreground/75 block">
                  Estimasi Saldo Rupiah
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Wallet className="size-4 text-primary-foreground/80 shrink-0" />
                  <span className="text-lg md:text-xl font-semibold tracking-tight">
                    Rp {isLoading ? 0 : saldoRupiah.toLocaleString("id-ID")}
                  </span>
                </div>
                <span className="text-[0.68rem] text-primary-foreground/60 mt-0.5 block">
                  1 poin = Rp {ratePoinKeRupiah.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              {/* CTA Pencairan Dana */}
              <Button
                id="btn-cairkan-dana"
                onClick={() => setOpenCairkanDialog(true)}
                className="w-full sm:w-auto gap-2.5 rounded-xl bg-background text-primary hover:bg-background/90 hover:text-primary font-semibold shadow-sm h-11 px-6 active:scale-95 transition-all"
              >
                <Banknote className="size-5" />
                <span>Cairkan Dana</span>
              </Button>

              {/* CTA Scan QR */}
              <Button
                className="w-full sm:w-auto gap-2.5 rounded-xl bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 font-semibold shadow-sm h-11 px-6 active:scale-95 transition-all border border-primary-foreground/20"
                render={<Link href="/warung/scan" />}
                nativeButton={false}
              >
                <ScanLine className="size-5" />
                <span>Scan QR</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ──────────────────── Banner Pending Pencairan ──────────────────── */}
        {hasPending && (
          <Card className="w-full overflow-hidden rounded-2xl border-0 bg-amber-500 text-amber-950 py-2">
            <CardContent className="flex items-center gap-4 px-5 md:px-6 md:py-1">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-800/15">
                <Clock3 className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1 text-amber-950">
                <div className="flex flex-wrap md:justify-between items-center gap-2">
                  <h3 className="font-semibold leading-tight">
                    Pencairan Dana Diproses
                  </h3>
                </div>
                <p className="text-xs text-amber-900/80">
                  Pengajuan Rp {pendingJumlahRupiah.toLocaleString("id-ID")}{" "}
                  sedang menunggu konfirmasi admin.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ──────────────────── Statistik Ringkas ──────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Transaksi */}
          <Card className="rounded-xl py-4 px-4 ring-1 border-0">
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="size-3.5 text-primary shrink-0" />
                <span className="text-[0.65rem] text-muted-foreground font-medium uppercase tracking-wide leading-tight">
                  Transaksi
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-10" />
              ) : (
                <p className="text-xl font-bold text-foreground leading-none">
                  {data?.stats.totalTransaksiPenukaran ?? 0}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Total Pencairan */}
          <Card className="rounded-xl py-4 px-4 ring-1 border-0">
            <CardContent className="p-0 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Banknote className="size-3.5 text-primary shrink-0" />
                <span className="text-[0.65rem] text-muted-foreground font-medium uppercase tracking-wide leading-tight">
                  Pencairan
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="text-lg font-bold text-foreground leading-none">
                  {(data?.stats.totalPencairan ?? 0) >= 1_000_000
                    ? `${((data?.stats.totalPencairan ?? 0) / 1_000_000).toFixed(1)}jt`
                    : (data?.stats.totalPencairan ?? 0) >= 1_000
                      ? `${((data?.stats.totalPencairan ?? 0) / 1_000).toFixed(0)}rb`
                      : `${(data?.stats.totalPencairan ?? 0).toLocaleString("id-ID")}`}
                </p>
              )}
              <span className="text-[0.6rem] text-muted-foreground">
                total (Rp)
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="font-bold text-lg md:text-xl text-foreground">
              Riwayat Terbaru
            </h2>
            <Link
              href="/warung/riwayat"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline active:scale-95 transition-transform"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex flex-col gap-2.5">
                {[1, 2, 3].map((item) => (
                  <CardRiwayatSkeleton key={item} />
                ))}
              </div>
            ) : data?.transaksi && data.transaksi.length > 0 ? (
              data.transaksi.map((item) => {
                // Untuk transaksi pencairan, tampilkan badge status
                if (item.type === "pencairan") {
                  const isPending = item.status === false;
                  return (
                    <Card
                      key={item.id}
                      className="py-3.5 px-4 md:px-5 rounded-xl bg-card ring-1"
                    >
                      <CardContent className="flex items-center justify-between p-0">
                        <div className="flex items-center gap-3.5">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                            <Banknote className="size-5" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-foreground leading-snug">
                                {item.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  isPending
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.6rem] px-1.5"
                                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.6rem] px-1.5"
                                }
                              >
                                {isPending ? "Menunggu" : "Selesai"}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {item.time}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-base md:text-lg shrink-0 ml-3 text-blue-600">
                          {item.rupiah}
                        </span>
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <CardRiwayat
                    key={item.id}
                    title={item.title}
                    date={item.time}
                    poin={item.poin}
                  />
                );
              })
            ) : (
              <div className="py-20 flex flex-col items-center justify-center gap-2 text-center text-sm">
                <p className="font-medium text-foreground">
                  Tidak ada transaksi ditemukan
                </p>
                <p className="text-xs max-w-xs text-muted-foreground">
                  Belum ada riwayat transaksi. Mulai scan QR warga untuk
                  melayani penukaran sembako.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CairkanDanaDialog
        open={openCairkanDialog}
        onOpenChange={setOpenCairkanDialog}
        saldoPoin={saldoPoin}
        saldoRupiah={saldoRupiah}
        ratePoinKeRupiah={ratePoinKeRupiah}
      />
    </>
  );
};

export default WarungDashboard;
