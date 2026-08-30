"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileData } from "@/types/user";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  FileCheck,
  Plus,
  RotateCcw,
  Save,
  Scale,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePenimbangan } from "./usePenimbangan";

interface PetugasPenimbanganProps {
  profile?: ProfileData;
  token?: string;
  wargaId?: string;
}

const PetugasPenimbangan = ({
  profile,
  token,
  wargaId,
}: PetugasPenimbanganProps) => {
  const {
    berat,
    setBerat,
    selectedKategoriId,
    setSelectedKategoriId,
    categories,
    isLoadingCategories,
    currentKategori,
    currentRate,
    calculatedPoints,
    handleSubmit,
    isPending,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    successData,
    handleNextScan,
    handleBackToDashboard,
  } = usePenimbangan({
    token,
    wargaId,
  });

  const userName = profile?.user?.name || "Warga";
  const userNoRumah = profile?.user?.noRumah
    ? profile.user.noRumah.toLowerCase().startsWith("blok")
      ? profile.user.noRumah
      : `Blok ${profile.user.noRumah}`
    : "Blok A2/15";
  const userImage = profile?.user?.image || undefined;

  const handleQuickAddWeight = (val: number) => {
    const current = parseFloat(berat) || 0;
    const nextVal = Math.round((current + val) * 10) / 10;
    setBerat(nextVal.toString());
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col gap-6 py-2">
      {/* 2. Verified Resident Card */}
      <div className="w-full rounded-2xl border border-border/70 bg-card p-4 shadow-xs flex items-center gap-4">
        <Avatar size="lg" className="size-13 sm:size-14 border border-border/40 shrink-0">
          <AvatarImage src={userImage} alt={userName} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
            {userName ? userName.substring(0, 2).toUpperCase() : "WG"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 justify-center">
          <h2 className="font-bold text-base sm:text-lg text-foreground truncate leading-snug">
            {userName}
          </h2>

          <p className="text-xs text-muted-foreground truncate">
            {userNoRumah}
          </p>
        </div>
      </div>

      {/* Form Input Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 3. Kategori Sampah (Select with shadcn UI) */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs sm:text-sm font-bold text-foreground">
            Jenis / Kategori Sampah
          </Label>

          <Select
            value={selectedKategoriId}
            onValueChange={(val) => {
              if (val) setSelectedKategoriId(String(val));
            }}
          >
            <SelectTrigger className="h-12 rounded-2xl bg-card border border-input/80 px-4 text-sm font-medium shadow-xs">
              <SelectValue placeholder="Pilih Kategori Sampah" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border bg-popover shadow-xl max-h-64">
              {categories.length > 0 ? (
                categories.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="font-medium text-foreground">
                        {item.namaKategori}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        ({item.ratePoinPerKg} Poin/kg)
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-xs text-center text-muted-foreground">
                  {isLoadingCategories ? "Memuat kategori..." : "Tidak ada kategori"}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Berat Sampah (kg) Input */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs sm:text-sm font-bold text-foreground">
            Berat Sampah (kg)
          </Label>

          <div className="relative flex items-center justify-center rounded-2xl border border-input bg-card h-20 px-6 shadow-xs focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
            <input
              id="berat-input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.0"
              value={berat}
              onChange={(e) => setBerat(e.target.value)}
              className="w-full text-center text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none tracking-tight placeholder:text-muted-foreground/30 font-sans"
              autoFocus
            />
            <span className="absolute right-5 text-sm font-medium text-muted-foreground select-none pointer-events-none">
              kg
            </span>
          </div>

          {/* Quick weight stepper chips */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
            {[0.5, 1, 2, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAddWeight(val)}
                className="flex-1 py-1 px-2.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="size-3 text-primary" />
                <span>{val} kg</span>
              </button>
            ))}
            {parseFloat(berat) > 0 && (
              <button
                type="button"
                onClick={() => setBerat("")}
                className="p-1 px-2 rounded-full border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive text-xs font-medium transition-colors active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                title="Reset Berat"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. Point Estimation Card (Estimasi Poin) */}
        <div className="w-full rounded-2xl bg-[#eff9f0] dark:bg-emerald-950/25 border border-[#d4edd6] dark:border-emerald-800/30 p-5 flex flex-col items-center justify-center text-center gap-1 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">
            Estimasi Poin:
          </span>

          <div className="text-3xl sm:text-4xl font-extrabold text-[#f59e0b] dark:text-amber-400 tracking-tight my-0.5">
            +{calculatedPoints.toLocaleString("id-ID")} Poin
          </div>

          <div className="bg-background/90 dark:bg-card/90 border border-border/50 rounded-full px-3.5 py-1 text-xs text-muted-foreground font-medium shadow-xs">
            Rate: 1 kg = {currentRate} Poin
          </div>
        </div>

        {/* 6. Action Button: Simpan & Tambah Poin */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending || !berat || parseFloat(berat) <= 0}
            className="w-full h-12 rounded-full bg-[#0a6c38] hover:bg-[#08562d] text-white font-bold text-sm sm:text-base gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="size-5" />
            <span>{isPending ? "Menyimpan..." : "Simpan & Tambah Poin"}</span>
          </Button>
        </div>
      </form>

      {/* Success Confirmation Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-3xl p-6 text-center gap-4">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            <DialogTitle className="text-lg font-bold text-center">
              Penimbangan Berhasil!
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Poin setoran sampah telah berhasil ditambahkan ke saldo warga.
            </DialogDescription>
          </DialogHeader>

          {successData && (
            <div className="rounded-2xl border bg-muted/40 p-4 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-muted-foreground">Warga:</span>
                <span className="font-semibold text-foreground">{successData.wargaNama}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-muted-foreground">Kategori:</span>
                <span className="font-semibold text-foreground">{successData.kategoriNama}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-muted-foreground">Berat:</span>
                <span className="font-semibold text-foreground font-mono">{successData.beratKg} kg</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Poin Masuk:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  +{successData.poinMasuk} Poin
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="button"
              onClick={handleNextScan}
              className="w-full h-11 rounded-full font-semibold gap-2 shadow-md"
            >
              <FileCheck className="size-4.5" />
              <span>Pindai Warga Berikutnya</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToDashboard}
              className="w-full h-11 rounded-full text-xs"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetugasPenimbangan;
