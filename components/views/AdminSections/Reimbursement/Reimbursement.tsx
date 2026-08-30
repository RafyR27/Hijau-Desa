"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { ReimbursementItem } from "@/types/reimbursement";
import { formatDateVerif } from "@/lib/formated";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import DibayarDialog from "./Dibayar/Dibayar-dialog";

export default function ReimbursementView() {
  const [openBayarDialog, setOpenBayarDialog] = useState(false);
  const [user, setUser] = useState<ReimbursementItem>();

  const { data, isLoading } = useQuery({
    queryKey: ["reimbursements"],
    queryFn: async () => {
      const res = await instance.get("/admin/reimbursement");
      return res.data.data;
    },
  });

  const handleBayarDialog = (user: ReimbursementItem) => {
    setOpenBayarDialog(true);
    setUser(user);
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Pencairan Dana
            </h2>
            <p className="text-sm text-muted-foreground">
              Kelola dan konfirmasi pencairan saldo rupiah untuk mitra warung
              atas penukaran poin warga.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
          <p className="text-xs sm:text-sm">
            Harap lakukan pemberian uang kepada mitra warung terkait sebelum
            menekan tombol <strong>Selesai Dibayar</strong>.
          </p>
        </div>

        {/* Claims List */}
        <Card className="py-0">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Informasi reimbursement */}
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-32" />
                      </div>

                      <Skeleton className="h-3 w-40 mt-0.5" />
                    </div>

                    {/* Total + button */}
                    <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 w-full md:w-auto">
                      <div className="text-left md:text-right">
                        <Skeleton className="h-3 w-24 mb-2 md:ml-auto" />
                        <Skeleton className="h-6 w-32 md:ml-auto" />
                      </div>

                      <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-16" />
                        <Skeleton className="h-9 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data.length > 0 ? (
              <div className="divide-y">
                {data.map((item: ReimbursementItem) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {item.owner}
                        </span>

                        {!item.status ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"
                          >
                            Menunggu
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                          >
                            Selesai Dibayar
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span>
                          No Handphone:{" "}
                          <strong className="text-foreground/80">
                            {item?.noHP?.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3")}
                          </strong>
                        </span>

                        <span>
                          Poin Diklaim:{" "}
                          <strong className="text-primary font-semibold">
                            {item.pointsClaimed}
                          </strong>
                        </span>
                      </div>

                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        Diajukan pada: {formatDateVerif(item.date)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">
                          Total Pencairan
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {item.amountRupiah}
                        </p>
                      </div>

                      {!item.status && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleBayarDialog(item)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Selesai Dibayar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-sm font-medium text-foreground">
                  Belum ada pengajuan pencairan
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pengajuan pencairan dari warung akan muncul di sini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {user && (
        <DibayarDialog
          open={openBayarDialog}
          onOpenChange={setOpenBayarDialog}
          user={user}
        />
      )}
    </>
  );
}
