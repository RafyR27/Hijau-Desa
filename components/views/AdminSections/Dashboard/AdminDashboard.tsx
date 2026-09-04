"use client";

import { SessionUser } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Trash2,
  ReceiptText,
  Banknote,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";

interface AdminDashboardProps {
  user?: SessionUser;
}

interface IDashboardAdmin {
  totalPengguna: number;
  totalSampah: number;
  totalTransaksiSetor: number;
  totalPoinTerdistribusi: number;
  totalWargaBaruMendaftar: number;
  totalPengajuanReimburs: number;
  ringkasanSistem: {
    kategoriAktif: number;
    ProdukAktif: number;
    konversiPoin: number;
  };
}

export default function AdminDashboardView({ user }: AdminDashboardProps) {
  const { data} = useQuery<IDashboardAdmin>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await instance.get("/admin/dashboard");

      return res.data.data;
    },
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Selamat Datang, {user?.name || "Admin"}!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan aktivitas bank sampah desa dan statistik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/verifikasi-warga"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Verifikasi Warga
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalPengguna ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sampah Terkumpul
            </CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalSampah ?? 0} kg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transaksi Setor Sampah
            </CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalTransaksiSetor ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Poin Terdistribusi
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalPoinTerdistribusi.toLocaleString("id-ID") ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Setara Rp{" "}
              {(
                (data?.totalPoinTerdistribusi ?? 0) *
                (data?.ringkasanSistem?.konversiPoin ?? 0)
              ).toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Activity Feed Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Menunggu Tindakan</CardTitle>
            <CardDescription>
              Permintaan warga dan reimbursement yang butuh persetujuan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-full">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {data?.totalWargaBaruMendaftar ?? 0} Warga Baru Mendaftar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Menunggu verifikasi identitas
                  </p>
                </div>
              </div>
              <Link
                href="/admin/verifikasi-warga"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Periksa <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-600 rounded-full">
                  <Banknote className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {data?.totalPengajuanReimburs ?? 0} Pengajuan Reimbursement
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dari Warung Mitra
                  </p>
                </div>
              </div>
              <Link
                href="/admin/reimbursement"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Periksa <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Sistem</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b text-sm">
              <span className="text-muted-foreground">
                Kategori Sampah Aktif
              </span>
              <span className="font-semibold">
                {data?.ringkasanSistem.kategoriAktif ?? 0} Kategori
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b text-sm">
              <span className="text-muted-foreground">
                Katalog Produk Tersedia
              </span>
              <span className="font-semibold">
                {data?.ringkasanSistem.ProdukAktif ?? 0} Produk
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Konversi Poin Aktif</span>
              <span className="font-semibold">
                1 Poin = Rp {data?.ringkasanSistem.konversiPoin ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
