"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Box } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { KatalogItem } from "@/types/katalog";
import { Skeleton } from "@/components/ui/skeleton";

import AddProductDialog from "./AddProduct/Add-product-dialog";
import EditProductDialog from "./EditProduct/Edit-product-dialog";
import DeleteProductDialog from "./DeleteProduct/Delete-product-dialog";

export default function ProductCatalogView() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEdit, setSelectedEdit] = useState<KatalogItem | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<KatalogItem | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await instance.get("/admin/product");
        return res.data.data;
      } catch {
        const res = await instance.get("/general/katalog");
        return res.data.data?.product || [];
      }
    },
  });

  const handleOpenEdit = (product: KatalogItem) => {
    setSelectedEdit(product);
    setEditOpen(true);
  };

  const handleOpenDelete = (product: KatalogItem) => {
    setSelectedDelete(product);
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
                Katalog Produk
              </h2>
              <p className="text-sm text-muted-foreground">
                Kelola barang yang dapat ditukar warga di Warung Mitra
                menggunakan saldo poin.
              </p>
            </div>
            <Button
              className="flex items-center gap-2 self-start sm:self-auto rounded-lg cursor-pointer w-full md:max-w-40"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4" /> Tambah Produk
            </Button>
          </div>

          {/* Product Grid */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              [0, 1, 2, 3].map((item) => (
                <Card
                  key={item}
                  className="overflow-hidden flex flex-col justify-between p-0"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden rounded-t-lg bg-muted">
                      <Skeleton className="h-full w-full rounded-none" />

                      {/* Badge */}
                      <Skeleton className="absolute top-3 right-3 h-5 w-16 rounded-full" />
                    </div>

                    {/* Product name */}
                    <CardHeader className="p-4 pb-2">
                      <Skeleton className="h-4 w-36" />
                    </CardHeader>
                  </div>

                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 pt-2 border-t gap-2">
                      {/* Price */}
                      <div>
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-6 w-24" />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-9 w-20 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : products && products.length > 0 ? (
              products.map((product: KatalogItem) => (
                <Card
                  key={product.id}
                  className="overflow-hidden flex flex-col justify-between p-0"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                      <Image
                        src={
                          product.image ||
                          "https://res.cloudinary.com/dejhqj1te/image/upload/v1787953889/no-image_skmrix.jpg"
                        }
                        alt={product.namaProduct}
                        fill
                        className="object-cover"
                      />

                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                        className={`absolute top-3 right-3 z-10 text-xs ${
                          product.isActive
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : ""
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Non-Aktif"}
                      </Badge>
                    </div>

                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-[0.9rem]">
                        {product.namaProduct}
                      </CardTitle>
                    </CardHeader>
                  </div>

                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 pt-2 border-t gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Harga Tukar
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {product.hargaPoin} Poin
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="default"
                          variant="ghost"
                          className="space-x-2 cursor-pointer"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => handleOpenDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-30 md:py-50 flex flex-col items-center">
                <Box className="mx-auto h-8 w-8 text-muted-foreground/50" />

                <p className="mt-3 text-sm font-medium text-foreground">
                  Belum ada Produk
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Tambahkan produk untuk mulai mengelolanya.
                </p>

                <Button
                  variant={"outline"}
                  className="flex items-center gap-2 self-start sm:self-auto rounded-lg mt-5 cursor-pointer"
                  onClick={() => setAddOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Tambah Produk
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Sub-Components */}
      <AddProductDialog open={addOpen} onOpenChange={setAddOpen} />

      <EditProductDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        product={selectedEdit}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedDelete}
      />
    </div>
  );
}
