"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import useEditProduct from "./useEditProduct";
import { useEffect } from "react";
import { KatalogItem } from "@/types/katalog";
import { ImageIcon, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: KatalogItem | null;
}

const EditProductDialog = ({
  open,
  onOpenChange,
  product,
}: EditProductDialogProps) => {
  const {
    control,
    handleSubmit,
    handleEditProduct,
    isPendingEditProduct,
    isSuccessEditProduct,
  } = useEditProduct({ product });

  useEffect(() => {
    if (isSuccessEditProduct) {
      onOpenChange(false);
    }
  }, [isSuccessEditProduct, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <form onSubmit={handleSubmit(handleEditProduct)}>
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah data produk dan penyesuaian harga poin penukaran.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 no-scrollbar max-h-[70vh] overflow-y-auto px-1">
            {/* Nama Produk */}
            <Controller
              name="namaProduct"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="namaProduct-edit">Nama Produk</Label>
                  <Input
                    {...field}
                    id="namaProduct-edit"
                    type="text"
                    placeholder="Contoh: Beras Super 5 Kg"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Harga Poin */}
            <Controller
              name="hargaPoin"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="hargaPoin-edit">Harga Poin Tukar</Label>
                  <Input
                    {...field}
                    id="hargaPoin-edit"
                    type="number"
                    placeholder="Contoh: 500"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      );
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Status Aktif */}
            <Controller
              name="isActive"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="isActive-product-edit">Status Produk</Label>
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                  >
                    <SelectTrigger
                      id="isActive-product-edit"
                      className="w-full"
                    >
                      <SelectValue placeholder="Pilih status">
                        {field.value ? "Aktif" : "Non-Aktif"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Non-Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Foto / Gambar Produk */}
            <Controller
              name="image"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label>Foto / Gambar Produk</Label>

                  {field.value ? (
                    <div className="relative h-44 w-full rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={field.value}
                        alt="Preview Produk"
                        className="h-full w-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-2 right-2 rounded-full cursor-pointer shadow-md"
                        onClick={() => field.onChange("")}
                        title="Hapus Gambar"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs font-medium text-foreground">
                        Klik untuk mengunggah gambar produk
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        PNG, JPG, WEBP hingga 5MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingEditProduct}
              className="md:w-35 w-full"
            >
              {isPendingEditProduct ? <Spinner /> : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
