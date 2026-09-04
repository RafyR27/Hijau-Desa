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
import useAddKategori from "./useAddKategori";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

interface AddKategoriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddKategoriDialog = ({ open, onOpenChange }: AddKategoriDialogProps) => {
  const {
    control,
    handleSubmit,
    handleAddKategori,
    isPendingAddKategori,
    isSuccessAddKategori,
  } = useAddKategori();

  useEffect(() => {
    if (isSuccessAddKategori) {
      onOpenChange(false);
    }
  }, [isSuccessAddKategori, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <form onSubmit={handleSubmit(handleAddKategori)}>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Sampah</DialogTitle>
            <DialogDescription>
              Isi informasi kategori sampah baru dan penentuan rate poin
              konversinya.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 space-y-1">
            {/* Nama Kategori */}
            <Controller
              name="namaKategori"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="namaKategori">Nama Kategori</Label>
                  <Input
                    {...field}
                    id="namaKategori"
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
                  <Label htmlFor="ratePoinPerKg">Tarif Poin (per Kg)</Label>
                  <Input
                    {...field}
                    id="ratePoinPerKg"
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
                  <Label htmlFor="isActive">Status Kategori</Label>
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                  >
                    <SelectTrigger id="isActive" className="w-full">
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
              disabled={isPendingAddKategori}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingAddKategori}
              className="md:w-35 w-full"
            >
              {isPendingAddKategori ? <Spinner /> : "Tambah Kategori"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddKategoriDialog;
