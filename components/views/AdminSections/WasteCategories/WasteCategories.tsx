"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { KategoriItem } from "@/types/kategori";
import { Skeleton } from "@/components/ui/skeleton";

import AddKategoriDialog from "./AddKategori/Add-kategori-dialog";
import EditKategoriDialog from "./EditKategori/Edit-kategori-dialog";
import DeleteKategoriDialog from "./DeleteKategori/Delete-kategori-dialog";

export default function WasteCategoriesView() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEdit, setSelectedEdit] = useState<KategoriItem | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<KategoriItem | null>(null);

  const { data: kategori, isLoading } = useQuery({
    queryKey: ["kategori"],
    queryFn: async () => {
      try {
        const res = await instance.get("/admin/kategori");
        return res.data.data;
      } catch {
        const res = await instance.get("/general/kategori");
        return res.data.data;
      }
    },
  });

  const handleOpenEdit = (cat: KategoriItem) => {
    setSelectedEdit(cat);
    setEditOpen(true);
  };

  const handleOpenDelete = (cat: KategoriItem) => {
    setSelectedDelete(cat);
    setDeleteOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-10 p-4 py-6 md:p-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Kategori Sampah
              </h2>
              <p className="text-sm text-muted-foreground">
                Kelola jenis sampah yang diterima bank sampah dan tentukan
                konversi poin per kilogram/liter.
              </p>
            </div>
            <Button
              className="flex items-center gap-2 self-start sm:self-auto rounded-lg cursor-pointer"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4" /> Tambah Kategori
            </Button>
          </div>

          {/* Grid of categories */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [0, 1, 2].map((item) => (
                <Card key={item} className="relative overflow-hidden ring-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-5 w-32" />
                      </div>

                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 mb-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-24" />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-16 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : kategori && kategori.length > 0 ? (
              kategori.map((cat: KategoriItem) => (
                <Card key={cat.id} className="relative overflow-hidden ring-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {cat.namaKategori}
                        </CardTitle>
                      </div>
                      <Badge
                        variant={cat.isActive ? "default" : "outline"}
                        className={
                          cat.isActive
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "text-muted-foreground"
                        }
                      >
                        {cat.isActive ? "Aktif" : "Non-Aktif"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 mb-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-amber-500" /> Tarif Poin:
                      </span>
                      <span className="font-bold text-base text-primary">
                        {cat.ratePoinPerKg} Poin{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          / Kg
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 cursor-pointer"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => handleOpenDelete(cat)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-30 md:py-50 flex flex-col items-center">
                <Trash2 className="mx-auto h-8 w-8 text-muted-foreground/50" />

                <p className="mt-3 text-sm font-medium text-foreground">
                  Belum ada kategori sampah
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Tambahkan kategori sampah untuk mulai mengelolanya.
                </p>

                <Button
                  variant={"outline"}
                  className="flex items-center gap-2 self-center rounded-lg mt-5 cursor-pointer"
                  onClick={() => setAddOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Tambah Kategori
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Sub-Components */}
      <AddKategoriDialog open={addOpen} onOpenChange={setAddOpen} />

      <EditKategoriDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        kategori={selectedEdit}
      />

      <DeleteKategoriDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        kategori={selectedDelete}
      />
    </div>
  );
}
