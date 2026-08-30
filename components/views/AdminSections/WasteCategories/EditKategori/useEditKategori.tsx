"use client";

import instance from "@/lib/instance";
import { KategoriItem } from "@/types/kategori";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formEditSchema = z.object({
  id: z.number(),
  namaKategori: z
    .string()
    .trim()
    .min(1, "Nama kategori wajib diisi")
    .min(2, "Nama kategori minimal 2 karakter"),
  ratePoinPerKg: z
    .number("Tarif poin wajib berupa angka")
    .min(1, "Tarif poin wajib diisi dan tidak boleh negatif"),
  isActive: z.boolean(),
});

export type IFormEditKategori = z.infer<typeof formEditSchema>;

const useEditKategori = ({ kategori }: { kategori: KategoriItem | null }) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormEditKategori>({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      id: kategori?.id ?? 0,
      namaKategori: kategori?.namaKategori ?? "",
      ratePoinPerKg: kategori?.ratePoinPerKg ?? 0,
      isActive: kategori?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (kategori) {
      reset({
        id: kategori.id,
        namaKategori: kategori.namaKategori,
        ratePoinPerKg: kategori.ratePoinPerKg,
        isActive: kategori.isActive,
      });
    }
  }, [kategori, reset]);

  const editKategoriService = async (payload: IFormEditKategori) => {
    const res = await instance.patch("/admin/kategori", payload);
    return res.data;
  };

  const {
    mutate: mutateEditKategori,
    isPending: isPendingEditKategori,
    isSuccess: isSuccessEditKategori,
  } = useMutation({
    mutationFn: editKategoriService,
    onError(error) {
      toast.error(error?.message || "Gagal mengedit kategori", {
        position: "top-right"
      });
    },
    onSuccess() {
      toast.success("Berhasil memperbarui kategori sampah!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
    },
  });

  const handleEditKategori = (data: IFormEditKategori) => mutateEditKategori(data);

  return {
    control,
    handleSubmit,
    handleEditKategori,
    isPendingEditKategori,
    isSuccessEditKategori,
    errors,
  };
};

export default useEditKategori;
