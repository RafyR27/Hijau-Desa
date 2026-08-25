/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import instance from "@/lib/instance";
import { useSyncExternalStore } from "react";

type QRState = {
  data: { qrImage?: string } | undefined;
  isLoading: boolean;
  error: any;
  timeLeft: number;
  expiresAt: number | null;
  isActive: boolean;
};

const STORAGE_KEY = "active_qr_data";

let qrState: QRState = {
  data: undefined,
  isLoading: false,
  error: null,
  timeLeft: 60,
  expiresAt: null,
  isActive: false,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

let timerInterval: NodeJS.Timeout | null = null;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!qrState.expiresAt) {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      return;
    }

    const remaining = Math.max(
      0,
      Math.ceil((qrState.expiresAt - Date.now()) / 1000),
    );

    if (remaining > 0) {
      qrState = { ...qrState, timeLeft: remaining, isActive: true };
      emitChange();
    } else {
      qrState = { ...qrState, timeLeft: 0, isActive: false };
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      emitChange();
    }
  }, 1000);
}

// Inisialisasi dari sessionStorage jika ada QR aktif yang belum kedaluwarsa
if (typeof window !== "undefined") {
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
        const remaining = Math.ceil((parsed.expiresAt - Date.now()) / 1000);
        qrState = {
          data: parsed.data,
          isLoading: false,
          error: null,
          timeLeft: remaining,
          expiresAt: parsed.expiresAt,
          isActive: true,
        };
        startTimer();
      }
    }
  } catch {}
}

export async function fetchQR(force = false) {
  if (qrState.isLoading) return;

  // Cek apakah data QR masih aktif dalam batas waktu
  if (!force && qrState.data && qrState.timeLeft > 0) {
    return;
  }

  // Cek juga dari storage jika state memori kosong
  if (!force && typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
          const remaining = Math.ceil((parsed.expiresAt - Date.now()) / 1000);
          qrState = {
            data: parsed.data,
            isLoading: false,
            error: null,
            timeLeft: remaining,
            expiresAt: parsed.expiresAt,
            isActive: true,
          };
          emitChange();
          startTimer();
          return;
        }
      }
    } catch {}
  }

  qrState = { ...qrState, isLoading: true, error: null };
  emitChange();

  try {
    const res = await instance.post("/warga/generate-qr");
    const expiresAt = Date.now() + 60 * 1000;
    const qrData = res.data.data;

    qrState = {
      data: qrData,
      isLoading: false,
      timeLeft: 60,
      expiresAt,
      isActive: true,
      error: null,
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data: qrData, expiresAt }),
        );
      } catch {}
    }

    emitChange();
    startTimer();
  } catch (err) {
    qrState = {
      ...qrState,
      isLoading: false,
      error: err,
    };
    emitChange();
  }
}

export function useQR() {
  const currentState = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => qrState,
    () => qrState,
  );

  const minutes = Math.floor(currentState.timeLeft / 60);
  const seconds = currentState.timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    generateQR: (force = false) => fetchQR(force),
    data: currentState.data,
    isLoading: currentState.isLoading,
    error: currentState.error,
    timeLeft: currentState.timeLeft,
    formattedTime,
    isExpired: currentState.timeLeft === 0 && Boolean(currentState.data),
  };
}




