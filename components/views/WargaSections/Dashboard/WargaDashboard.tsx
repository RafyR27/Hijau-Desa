"use client";

import { CardRiwayat } from "@/components/commons/CardRiwayat/CardRiwayat";
import Link from "next/link";
import { SessionUser } from "@/types/user";
import { CardPoin } from "@/components/commons/CardPoin/CardPoin";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { TransactionItem } from "@/types/dashboard";
import { CardRiwayatSkeleton } from "@/components/commons/CardSkeleton/CardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock3 } from "lucide-react";

const WargaDashboard = ({ user }: { user?: SessionUser }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await instance.get("/warga/dashboard");
      return res.data.data;
    },
  });

  return (
    <div className="w-full mx-auto flex flex-col gap-6 md:gap-8">
      <CardPoin id="card" user={user} saldo={data.saldo} />

      <Card
        id={user?.statusVerifikasi ? undefined : "status-verifikasi"}
        className={cn(
          "w-full overflow-hidden rounded-2xl border-0 bg-blue-100 text-blue-950  py-2",
          user?.statusVerifikasi ? "hidden" : "block",
        )}
      >
        <CardContent className="flex items-center gap-4 px-5 md:px-6 md:py-1">
          {/* Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-800/15">
            <Clock3 className="size-5" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-1 text-blue-950 justify-center">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h3 className="font-semibold leading-tight">
                Menunggu Verifikasi
              </h3>

              <span className="rounded-full bg-blue-800/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide">
                Dalam Proses
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Riwayat */}
      <div className="flex flex-col gap-4">
        <div id="riwayat" className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-lg md:text-xl text-foreground">
            Riwayat Terbaru
          </h2>
          <Link
            href="/warga/riwayat"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline active:scale-95 transition-transform"
          >
            Lihat Semua
          </Link>
        </div>

        {/* Transaction List */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3].map((item) => (
                <CardRiwayatSkeleton key={item} />
              ))}
            </div>
          ) : data?.transaksi?.length > 0 ? (
            data?.transaksi?.map((item: TransactionItem) => (
              <CardRiwayat
                key={item.id}
                title={item.title}
                date={item.time}
                poin={item.poin}
                weight={item.weight}
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-center text-sm">
              <p className="font-medium text-foreground">
                Tidak ada transaksi ditemukan
              </p>
              <p className="text-xs max-w-xs text-muted-foreground">
                Belum ada riwayat transaksi saat ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WargaDashboard;
