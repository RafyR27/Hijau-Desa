"use client";

import instance from "@/lib/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface KategoriItem {
  id: number;
  namaKategori: string;
  ratePoinPerKg: number;
  isActive: boolean;
}

interface UsePenimbanganProps {
  token?: string;
  wargaId?: string;
}

export function usePenimbangan({ token, wargaId }: UsePenimbanganProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [berat, setBerat] = useState<string>("");
  const [selectedKategoriId, setSelectedKategoriId] = useState<string>("1");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{
    poinMasuk: number;
    beratKg: number;
    kategoriNama: string;
    wargaNama: string;
  } | null>(null);

  // Fetch categories from API
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    KategoriItem[]
  >({
    queryKey: ["kategori-sampah"],
    queryFn: async () => {
      const res = await instance.get("/petugas/penimbangan");
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Selected category object
  const currentKategori = useMemo(() => {
    if (!categories || categories.length === 0) {
      return {
        id: 1,
        namaKategori: "Plastik & Botol",
        ratePoinPerKg: 150,
        isActive: true,
      };
    }
    const found = categories.find((c) => String(c.id) === selectedKategoriId);
    return found || categories[0];
  }, [categories, selectedKategoriId]);

  const currentRate = currentKategori?.ratePoinPerKg || 150;

  // Real-time calculation of estimated points
  const calculatedPoints = useMemo(() => {
    const numBerat = parseFloat(berat);
    if (isNaN(numBerat) || numBerat <= 0) return 0;
    return Math.round(numBerat * currentRate);
  }, [berat, currentRate]);

  // Mutation to save weighing transaction
  const { mutate: simpanPenimbangan, isPending } = useMutation({
    mutationFn: async () => {
      const numBerat = parseFloat(berat);
      if (isNaN(numBerat) || numBerat <= 0) {
        throw new Error("Masukkan berat sampah yang valid");
      }
      if (!wargaId) {
        throw new Error("Data warga tidak valid");
      }

      const res = await instance.post("/petugas/penimbangan", {
        token,
        wargaId,
        kategoriId: currentKategori.id,
        beratKg: numBerat,
      });

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["riwayat"] });

      const resData = data?.data?.transaksi;
      setSuccessData({
        poinMasuk: resData?.poinMasuk || calculatedPoints,
        beratKg: resData?.beratKg || parseFloat(berat),
        kategoriNama: currentKategori.namaKategori,
        wargaNama: resData?.warga?.name || "Warga",
      });

      toast.success(data?.message || "Penimbangan berhasil disimpan!", {
        position: "top-right",
      });

      setIsSuccessModalOpen(true);
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Gagal menyimpan penimbangan sampah.",
        {
          position: "top-right",
        }
      );
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    simpanPenimbangan();
  };

  const handleNextScan = () => {
    setIsSuccessModalOpen(false);
    router.push("/petugas/scan");
  };

  const handleBackToDashboard = () => {
    setIsSuccessModalOpen(false);
    router.push("/petugas/dashboard");
  };

  return {
    berat,
    setBerat,
    selectedKategoriId,
    setSelectedKategoriId,
    categories,
    isLoadingCategories,
    currentKategori,
    currentRate,
    calculatedPoints,
    simpanPenimbangan,
    handleSubmit,
    isPending,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    successData,
    handleNextScan,
    handleBackToDashboard,
  };
}
