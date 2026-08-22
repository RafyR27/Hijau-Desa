"use client";

import CardRiwayat from "@/components/commons/CardRiwayat/CardRiwayat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types/user";
import { useState } from "react";

type Filter = "semua" | "masuk" | "keluar";

const RiwayatLayout = ({ user }: { user?: SessionUser }) => {
  const [filter, setFilter] = useState<Filter>("semua");

  const filters: { label: string; value: Filter }[] = [
    { label: "Semua", value: "semua" },
    { label: "Masuk", value: "masuk" },
    { label: "Keluar", value: "keluar" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col gap-7">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-[1.5rem]">Riwayat Poin</h1>
        <p className="text-muted-foreground">
          Pantau aktivitas pengumpulan dan pengeluaran poin anda.
        </p>
      </div>

      <div className="flex gap-2">
        {filters.map((item) => (
          <Button
            key={item.value}
            onClick={() => setFilter(item.value)}
            variant={filter === item.value ? "default" : "outline"}
            className={cn(
              "rounded-full px-5",
              filter === item.value
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-primary/30 bg-background text-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            {item.label}
          </Button>
        ))}
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
  );
};

export default RiwayatLayout;
