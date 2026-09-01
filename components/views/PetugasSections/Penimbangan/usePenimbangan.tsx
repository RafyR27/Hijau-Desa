"use client";

import instance from "@/lib/instance";
import { KategoriItem } from "@/types/kategori";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface UsePenimbanganProps {
  token?: string;
  wargaId?: string;
}

const formPenimbanganSchema = z.object({
  kategori: z.string().min(1, "Kategori wajib diisi"),
  berat: z
    .number()
    .min(0.01, "Berat minimal 0.01 kg")
    .max(100, "Berat maksimal 100 kg"),
});

export type IFormPenimbangan = z.infer<typeof formPenimbanganSchema>;

export function usePenimbangan({ token, wargaId }: UsePenimbanganProps) {
  const router = useRouter();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["kategori-sampah"],
    queryFn: async () => {
      const res = await instance.get("/petugas/kategori");
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { control, handleSubmit } = useForm<IFormPenimbangan>({
    resolver: zodResolver(formPenimbanganSchema),
    defaultValues: {
      kategori: "",
      berat: 0,
    },
  });

  const simpanPenimbangan = async (payload: IFormPenimbangan) => {
    const kategoriId =
      categories.find(
        (item: KategoriItem) => item.namaKategori === payload.kategori,
      )?.id ?? 0;

    const response = await instance.post("/petugas/timbang", {
      wargaId,
      kategoriSampahId: kategoriId,
      berat: payload.berat,
      token,
    });

    return response.data;
  };

  // Mutation to save weighing transaction
  const {
    mutate: mutateSimpanPenimbangan,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: simpanPenimbangan,
    onSuccess: (data) => {
      router.push(
        `/petugas/success?token=${token}&wargaId=${wargaId}&transaksiId=${data.data.id}`,
      );
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menyimpan penimbangan sampah.", {
        position: "top-right",
      });

      router.push("/petugas/scan");
    },
  });

  const handleSimpanPenimbangan = (payload: IFormPenimbangan) =>
    mutateSimpanPenimbangan(payload);

  const selectedKategori = useWatch({
    control,
    name: "kategori",
  });

  const berat = useWatch({
    control,
    name: "berat",
  });

  const currentRate =
    categories.find(
      (item: KategoriItem) => item.namaKategori === selectedKategori,
    )?.ratePoinPerKg ?? 0;

  const calculatedPoints = useMemo(() => {
    const numBerat = berat;
    if (isNaN(numBerat) || numBerat <= 0) return 0;
    return Math.floor(numBerat * currentRate);
  }, [berat, currentRate]);

  return {
    berat,
    categories,
    isLoadingCategories,
    currentRate,
    calculatedPoints,
    simpanPenimbangan,
    isPending,
    isSuccess,
    control,
    handleSubmit,
    handleSimpanPenimbangan,
  };
}
