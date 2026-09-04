"use client";

import { useEffect, useRef } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import instance from "@/lib/instance";

export type OnboardingRole = "warga" | "petugas" | "warung" | "admin" | string;

export interface OnboardingTutorialProps {
  role?: OnboardingRole;
  newAccount?: boolean;
}

export const onboardingSteps: Record<string, DriveStep[]> = {
  warga: [
    {
      element: "#welcome",
      popover: {
        title: "Selamat datang di Hijau Desa",
        description: "Sebelum memulai, mari kita lihat beberapa fitur utama.",
      },
    },
    {
      element: "#card",
      popover: {
        title: "Kartu Poin",
        description:
          "Disini kamu bisa melihat jumlah poin yang kamu miliki dan tombol tampilkan QR untuk menukarkan poin dan menyetor sampah.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#notification",
      popover: {
        title: "Notifikasi",
        description:
          "Disini kamu bisa melihat notifikasi terkini mengenai produk baru, konversi poin, dan lainnya.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#status-verifikasi",
      popover: {
        title: "Status Verifikasi",
        description:
          "Untuk akun baru, kamu harus menunggu verifikasi dari RW atau Kepala Desa sebelum bisa menggunakan fitur lainnya ya.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#riwayat",
      popover: {
        title: "Riwayat Terbaru",
        description:
          "Disini kamu bisa melihat sedikit mengenai riwayat transaksi kamu.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#beranda",
      popover: {
        title: "Beranda",
        description:
          "Disini kamu bisa melihat informasi terkini mengenai akun kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#riwayatBottom",
      popover: {
        title: "Riwayat",
        description: "Disini kamu bisa melihat riwayat transaksi kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#qr-button",
      popover: {
        title: "Tombol Tampilkan QR",
        description:
          "Disini kamu juga bisa menampilkan QR Code untuk menukarkan poin dan menyetor sampah.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#katalog",
      popover: {
        title: "Katalog",
        description: "Disini kamu bisa melihat katalog produk yang tersedia.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#profile",
      popover: {
        title: "Profil",
        description: "Disini kamu bisa melihat dan mengelola akun kamu.",
        side: "top",
        align: "start",
      },
    },
  ],

  petugas: [
    {
      element: "#welcome",
      popover: {
        title: "Selamat datang di Hijau Desa",
        description: "Sebelum memulai, mari kita lihat beberapa fitur utama.",
      },
    },
    {
      element: "#card",
      popover: {
        title: "Kartu Petugas",
        description:
          "Disini kamu bisa menekan tombol untuk melakukan scan QR Code warga untuk menyetor sampah.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#notification",
      popover: {
        title: "Notifikasi",
        description:
          "Disini kamu bisa melihat notifikasi terkini mengenai produk baru, konversi poin, dan lainnya.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#card-informations",
      popover: {
        title: "Kartu Informasi",
        description:
          "Disini kamu bisa melihat informasi mengenai total sampah yang sudah disetor dan total transaksi yang sudah dilakukan.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#riwayat",
      popover: {
        title: "Riwayat Terbaru",
        description:
          "Disini kamu bisa melihat sedikit mengenai riwayat transaksi kamu.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#beranda",
      popover: {
        title: "Beranda",
        description:
          "Disini kamu bisa melihat informasi terkini mengenai akun kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#riwayatBottom",
      popover: {
        title: "Riwayat",
        description: "Disini kamu bisa melihat riwayat transaksi kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#qr-button",
      popover: {
        title: "Tombol Scan QR",
        description:
          "Disini kamu juga bisa melakukan scan QR Code warga untuk menyetor sampah.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#katalog",
      popover: {
        title: "Katalog",
        description: "Disini kamu bisa melihat katalog produk yang tersedia.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#profile",
      popover: {
        title: "Profil",
        description: "Disini kamu bisa melihat dan mengelola akun kamu.",
        side: "top",
        align: "start",
      },
    },
  ],

  warung: [
    {
      element: "#welcome",
      popover: {
        title: "Selamat datang di Hijau Desa",
        description: "Sebelum memulai, mari kita lihat beberapa fitur utama.",
      },
    },
    {
      element: "#card",
      popover: {
        title: "Kartu Poin",
        description:
          "Disini kamu bisa melihat poin warung kamu, menekan tombol untuk melakukan scan QR Code warga untuk melakukan penukaran barang, dan menekan tombol cairkan dana untuk mencairkan dana.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#notification",
      popover: {
        title: "Notifikasi",
        description:
          "Disini kamu bisa melihat notifikasi terkini mengenai produk baru, konversi poin, dan lainnya.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#card-informations",
      popover: {
        title: "Kartu Informasi",
        description:
          "Disini kamu bisa melihat informasi mengenai total transaksi yang sudah dilakukan dan total dana yang sudah dicairkan.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#riwayat",
      onHighlightStarted: (element) => {
        element?.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      },
      popover: {
        title: "Riwayat Terbaru",
        description:
          "Disini kamu bisa melihat sedikit mengenai riwayat transaksi kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#beranda",
      popover: {
        title: "Beranda",
        description:
          "Disini kamu bisa melihat informasi terkini mengenai akun kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#riwayatBottom",
      popover: {
        title: "Riwayat",
        description: "Disini kamu bisa melihat riwayat transaksi kamu.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#qr-button",
      popover: {
        title: "Tombol Scan QR",
        description:
          "Disini kamu juga bisa melakukan scan QR Code warga untuk melakukan penukaran barang.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#katalog",
      popover: {
        title: "Katalog",
        description: "Disini kamu bisa melihat katalog produk yang tersedia.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#profile",
      popover: {
        title: "Profil",
        description: "Disini kamu bisa melihat dan mengelola akun kamu.",
        side: "top",
        align: "start",
      },
    },
  ],
};

export default function OnboardingTutorial({
  role,
  newAccount,
}: OnboardingTutorialProps) {
  const isCompletedRef = useRef(false);

  useEffect(() => {
    if (!newAccount || !role) return;

    const steps = onboardingSteps[role];
    if (!steps || steps.length === 0) return;

    const handleComplete = async () => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;

      try {
        await instance.patch("/general/onboarding");
      } catch (error) {
        console.error("Failed to update onboarding status:", error);
      }
    };

    const driverObj = driver({
      showProgress: true,
      allowClose: false,
      disableActiveInteraction: true,

      popoverClass: "hijau-desa-popover",

      nextBtnText: "Lanjut",
      prevBtnText: "Kembali",
      doneBtnText: "Selesai",
      progressText: "{{current}} dari {{total}}",
      steps,
      onDestroyed: () => {
        handleComplete();
      },
    });

    const timeout = setTimeout(() => {
      try {
        driverObj.drive();
      } catch (err) {
        console.error("Error starting driver tutorial:", err);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      try {
        driverObj.destroy();
      } catch {
        // ignore teardown error
      }
    };
  }, [newAccount, role]);

  return null;
}
