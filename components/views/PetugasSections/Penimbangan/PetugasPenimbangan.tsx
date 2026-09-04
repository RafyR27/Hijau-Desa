"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileData } from "@/types/user";
import { Plus } from "lucide-react";
import { usePenimbangan } from "./usePenimbangan";
import { Spinner } from "@/components/ui/spinner";
import { KategoriItem } from "@/types/kategori";
import { Controller } from "react-hook-form";

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
    categories,
    isLoadingCategories,
    currentRate,
    calculatedPoints,
    handleSubmit,
    isPending,
    handleSimpanPenimbangan,
    control,
    isSuccess,
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
  const userImage =
    profile?.user?.image ||
    "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_3_ytpno7.png";

  return (
    <div className=" mx-auto flex flex-col gap-8 py-2">
      <div className="w-full rounded-2xl border border-border/70 bg-card p-4 shadow-xs flex items-center gap-4">
        <Avatar
          size="lg"
          className="size-13 sm:size-14 border border-border/40 shrink-0"
        >
          <AvatarImage
            src={userImage}
            alt={userName}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
            {userName ? userName.substring(0, 2).toUpperCase() : "WG"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 justify-center gap-1">
          <h2 className="font-bold text-base sm:text-lg text-foreground truncate leading-snug">
            {userName}
          </h2>

          <p className="text-xs text-muted-foreground truncate">
            {userNoRumah}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleSimpanPenimbangan)}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <Controller
            name="kategori"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <Label className="text-xs sm:text-sm font-bold text-foreground">
                  Jenis / Kategori Sampah
                </Label>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full py-6 rounded-lg bg-card border border-input/80 px-4 text-sm font-medium shadow-xs">
                    <SelectValue placeholder="Pilih Kategori Sampah" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((item: KategoriItem) => (
                        <SelectItem key={item.id} value={item.namaKategori} className="py-2">
                          <div className="flex w-full items-center justify-between gap-4">
                            <span className="font-medium text-foreground">
                              {item.namaKategori}
                            </span>

                            <span className="shrink-0 text-xs text-muted-foreground">
                              ({item.ratePoinPerKg} Poin/kg)
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-center text-muted-foreground">
                        {isLoadingCategories
                          ? "Memuat kategori..."
                          : "Tidak ada kategori"}
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            name="berat"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <Label className="text-xs sm:text-sm font-bold text-foreground">
                  Berat Sampah (kg)
                </Label>

                <div className="relative flex items-center justify-center rounded-lg border border-input bg-card h-20 px-6 shadow-xs focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
                  <input
                    id="berat-input"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.0"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      );
                    }}
                    className="w-full text-center text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none tracking-tight placeholder:text-muted-foreground/30 font-sans"
                    autoFocus
                  />

                  <span className="absolute right-5 text-sm font-medium text-muted-foreground select-none pointer-events-none">
                    Kg
                  </span>
                </div>

                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}

                {/* Quick weight stepper chips */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {[0.5, 1, 2, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        const current = field.value || 0;
                        field.onChange(current + val);
                      }}
                      className="flex-1 py-2 px-2.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3 text-primary" />
                      <span>{val} Kg</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          />
        </div>

        <div className="w-full rounded-lg bg-secondary/15 border border-secondary/35 p-5 flex flex-col items-center justify-center text-center gap-3 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">
            Estimasi Poin:
          </span>

          <div className="text-3xl sm:text-4xl font-bold text-primary tracking-tight my-0.5">
            +{calculatedPoints.toLocaleString("id-ID")} Poin
          </div>

          <div className="bg-background/90 border border-border/50 rounded-lg px-3.5 py-1 text-xs text-muted-foreground font-medium shadow-xs">
            Rate: 1 kg = {currentRate} Poin
          </div>
        </div>

        <div className="pt-12">
          <Button
            type="submit"
            disabled={isPending || !berat || berat <= 0 || isSuccess}
            className="w-full h-12 rounded-full flex"
          >
            {isPending || isSuccess ? (
              <Spinner />
            ) : (
              <>
                Simpan & Tambah Poin
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PetugasPenimbangan;
