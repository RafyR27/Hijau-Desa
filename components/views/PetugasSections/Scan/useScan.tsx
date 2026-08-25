"use client";

import instance from "@/lib/instance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useScan() {
  const router = useRouter();

  const { mutate: verifyQR, isPending } = useMutation({
    mutationFn: async (token: string) => {
      const res = await instance.get("/warga/check-qr", {
        params: { token },
      });
      return res.data;
    },
    onSuccess: (data, token) => {
      toast.success(data?.message || "QR Code berhasil diverifikasi!");
      const wargaUser = data?.data?.user;

      const queryParams = new URLSearchParams();
      queryParams.set("token", token);
      if (wargaUser?.id) queryParams.set("wargaId", wargaUser.id);
      if (wargaUser?.name) queryParams.set("wargaName", wargaUser.name);
      if (wargaUser?.noRumah) queryParams.set("noRumah", wargaUser.noRumah);

      router.push(`/petugas/penimbangan?${queryParams.toString()}`);
    },
    onError: (error) => {
      toast.error(
        error?.message || "QR Code tidak valid atau sudah kedaluwarsa.",
      );
    },
  });

  const handleScan = (token: string) => {
    verifyQR(token);
  };

  return {
    handleScan,
    verifyQR,
    isLoading: isPending,
  };
}
