"use client";

import { SessionUser } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Trash2, 
  ReceiptText, 
  Banknote, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AdminDashboardProps {
  user?: SessionUser;
}

export default function AdminDashboardView({ user }: AdminDashboardProps) {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border border-primary/20">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, {user?.name || "Admin"}! 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan aktivitas bank sampah desa dan statistik terkini hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/verifikasi-warga"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Verifikasi Warga
          </Link>
          <Link
            href="/admin/reports"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Lihat Laporan
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" /> +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sampah Terkumpul</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,420 kg</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" /> +8.4% minggu ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" /> 24 transaksi baru
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poin Terdistribusi</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85,200</div>
            <p className="text-xs text-muted-foreground mt-1">Setara Rp 8.520.000</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Activity Feed Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Menunggu Tindakan</CardTitle>
            <CardDescription>Permintaan warga dan reimbursement yang butuh persetujuan</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-full">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">3 Warga Baru Mendaftar</p>
                  <p className="text-xs text-muted-foreground">Menunggu verifikasi identitas</p>
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
                  <p className="text-sm font-medium">2 Pengajuan Reimbursement</p>
                  <p className="text-xs text-muted-foreground">Dari Warung Mitra</p>
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
            <CardDescription>Status layanan dan master data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b text-sm">
              <span className="text-muted-foreground">Status Database & Server</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Normal
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b text-sm">
              <span className="text-muted-foreground">Kategori Sampah Aktif</span>
              <span className="font-semibold">6 Kategori</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b text-sm">
              <span className="text-muted-foreground">Katalog Produk Tersedia</span>
              <span className="font-semibold">12 Produk</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Konversi Poin Aktif</span>
              <span className="font-semibold">1 Poin = Rp 100</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
