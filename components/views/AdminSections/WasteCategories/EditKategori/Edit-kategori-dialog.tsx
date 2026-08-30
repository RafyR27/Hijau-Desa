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
import useEditKategori from "./useEditKategori";
import { useEffect } from "react";
import { KategoriItem } from "@/types/kategori";
import { Spinner } from "@/components/ui/spinner";

interface EditKategoriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kategori: KategoriItem | null;
}

const EditKategoriDialog = ({
  open,
  onOpenChange,
  kategori,
}: EditKategoriDialogProps) => {
  const {
    control,
    handleSubmit,
    handleEditKategori,
    isPendingEditKategori,
    isSuccessEditKategori,
  } = useEditKategori({ kategori });

  useEffect(() => {
    if (isSuccessEditKategori) {
      onOpenChange(false);
    }
  }, [isSuccessEditKategori, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <form onSubmit={handleSubmit(handleEditKategori)}>
          <DialogHeader>
            <DialogTitle>Edit Kategori Sampah</DialogTitle>
            <DialogDescription>
              Ubah data kategori sampah dan penyesuaian tarif poin konversi.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 space-y-1">
            {/* Nama Kategori */}
            <Controller
              name="namaKategori"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="namaKategori-edit">Nama Kategori</Label>
                  <Input
                    {...field}
                    id="namaKategori-edit"
                    type="text"
                    placeholder="Contoh: Plastik & Botol"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Rate Poin Per Kg */}
            <Controller
              name="ratePoinPerKg"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="ratePoinPerKg-edit">
                    Tarif Poin (per Kg)
                  </Label>
                  <Input
                    {...field}
                    id="ratePoinPerKg-edit"
                    type="number"
                    placeholder="Contoh: 100"
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
                  <Label htmlFor="isActive-edit">Status Kategori</Label>
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                  >
                    <SelectTrigger id="isActive-edit" className="w-full">
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
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPendingEditKategori}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingEditKategori}
              className="md:w-40 w-full"
            >
              {isPendingEditKategori ? <Spinner /> : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditKategoriDialog;
