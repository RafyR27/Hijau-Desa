"use client";

import instance from "@/lib/instance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { QRScannerHandle } from "@/components/commons/QRScanner/QRScanner";

export function useScan() {
  const router = useRouter();
  const scannerRef = useRef<QRScannerHandle | null>(null);

  const resetScanner = (cooldownMs = 1000) => {
    scannerRef.current?.resetScanner(cooldownMs);
  };

  const { mutate: verifyQR, isPending } = useMutation({
    mutationFn: async (token: string) => {
      const res = await instance.get("/warga/check-qr", {
        params: { token },
      });
      return res.data;
    },
    onSuccess: (data, token) => {
      toast.success(data?.message || "QR Code berhasil diverifikasi!", {
        position: "top-right",
      });
      const wargaUser = data?.data?.user;

      const queryParams = new URLSearchParams();
      queryParams.set("token", token);
      if (wargaUser?.id) queryParams.set("id", wargaUser.id);

      router.push(`/warung/penukaran?${queryParams.toString()}`);
    },
    onError: (error) => {
      toast.error(
        error?.message || "QR Code tidak valid atau sudah kadaluwarsa.",
        {
          position: "top-right",
        },
      );
      resetScanner();
    },
  });

  const handleScan = (token: string) => {
    verifyQR(token);
  };

  return {
    handleScan,
    verifyQR,
    isLoading: isPending,
    scannerRef,
    resetScanner,
  };
}
