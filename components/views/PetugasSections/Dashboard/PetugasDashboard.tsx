"use client";

import { CardPetugas } from "@/components/commons/CardPoin/CardPoin";
import {CardPetugasGrid, CardRiwayat} from "@/components/commons/CardRiwayat/CardRiwayat";
import { CardRiwayatSkeleton } from "@/components/commons/CardSkeleton/CardSkeleton";
import instance from "@/lib/instance";
import { TransactionItem } from "@/types/dashboard";
import { SessionUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const PetugasDashboard = ({ user }: { user?: SessionUser }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await instance.get("/petugas/dashboard");
      return res.data.data;
    },
  });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 md:gap-8">
      {/* Dashboard Petugas */}
      <CardPetugas user={user} />

      <div className="grid grid-cols-2 gap-3">
        <CardPetugasGrid title="Total Sampah" totalSampah={data?.totalSampah ?? 0} />
        <CardPetugasGrid title="Total Transaksi" totalSetor={data?.totalSetor ?? 0} />
      </div>

      {/* Riwayat */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-lg md:text-xl text-foreground">
            Riwayat Terbaru
          </h2>
          <Link
            href="/petugas/riwayat"
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

export default PetugasDashboard;
