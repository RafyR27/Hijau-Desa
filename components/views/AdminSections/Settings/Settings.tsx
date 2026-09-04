"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { Skeleton } from "@/components/ui/skeleton";
import EditKonfigurasiDialog from "./SettingDialog/Edit-konfigurasi-dialog";

export default function SettingsView() {
  const [conversionRate, setConversionRate] = useState("");
  const [openKonfigurasiDialog, setOpenKonfigurasiDialog] = useState(false);
  const [konfigurasi, setKonfigurasi] = useState<{
    id: number;
    ratePoinKeRupiah: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["konfigurasi"],
    queryFn: async () => {
      const res = await instance.get("/admin/konfigurasi");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConversionRate(String(data.ratePoinKeRupiah));
    }
  }, [data]);

  const handleKonfigurasiDialog = (konfigurasi: {
    id: number;
    ratePoinKeRupiah: string;
  }) => {
    const payload = {
      id: konfigurasi.id,
      ratePoinKeRupiah: conversionRate,
    };

    setOpenKonfigurasiDialog(true);
    setKonfigurasi(payload);
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-4 py-6 md:p-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Pengaturan Sistem
          </h2>
          <p className="text-sm text-muted-foreground">
            Konfigurasi global parameter sistem, konversi poin bank sampah, dan
            info profil desa.
          </p>
        </div>

        <div className="flex-1  gap-6">
          {/* Poin & Ekonomi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" /> Pengaturan Nilai
                Konversi Poin
              </CardTitle>
              <CardDescription>
                Menentukan nilai tukar default 1 Poin warga ke nilai mata uang
                Rupiah untuk reimbursement warung mitra.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="conversion">Nilai 1 Poin (Rupiah)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>

                  {isLoading ? (
                    <Skeleton className="w-full h-9"></Skeleton>
                  ) : (
                    <Input
                      id="conversion"
                      type="number"
                      min={1}
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Contoh: Jika diset Rp 100, maka 1.000 poin setara dengan Rp
                  100.000 (1.000 poin x Rp 100).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            className="flex items-center gap-2"
            onClick={() => handleKonfigurasiDialog(data)}
            disabled={
              conversionRate === String(data?.ratePoinKeRupiah) || isLoading
            }
          >
            <Save className="h-4 w-4" /> Simpan Perubahan
          </Button>
        </div>
      </div>

      {konfigurasi && (
        <EditKonfigurasiDialog
          open={openKonfigurasiDialog}
          onOpenChange={setOpenKonfigurasiDialog}
          konfigurasi={konfigurasi}
        />
      )}
    </>
  );
}
