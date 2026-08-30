"use client";

import instance from "@/lib/instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formAddSchema = z.object({
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

export type IFormAddKategori = z.infer<typeof formAddSchema>;

const useAddKategori = () => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormAddKategori>({
    resolver: zodResolver(formAddSchema),
    defaultValues: {
      namaKategori: "",
      ratePoinPerKg: 0,
      isActive: true,
    },
  });

  const addKategoriService = async (payload: IFormAddKategori) => {
    await instance.post("/admin/kategori", payload);
  };

  const {
    mutate: mutateAddKategori,
    isPending: isPendingAddKategori,
    isSuccess: isSuccessAddKategori,
  } = useMutation({
    mutationFn: addKategoriService,
    onError(error) {
      toast.error(error?.message || "Gagal menambahkan kategori", {
        position: "top-right"
      });
    },
    onSuccess() {
      toast.success("Berhasil menambahkan kategori sampah baru!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
      reset({
        namaKategori: "",
        ratePoinPerKg: 0,
        isActive: true,
      });
    },
  });

  const handleAddKategori = (data: IFormAddKategori) => mutateAddKategori(data);

  return {
    control,
    handleSubmit,
    handleAddKategori,
    isPendingAddKategori,
    isSuccessAddKategori,
    errors,
  };
};

export default useAddKategori;
