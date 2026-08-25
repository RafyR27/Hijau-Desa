/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  RefreshCw,
  ScanLine,
  CheckCircle2,
  SwitchCamera,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface QRScannerProps {
  onScan: (value: string) => void;
  onError?: (error: string) => void;
  fps?: number;
  qrbox?: number;
}

export default function QRScanner({
  onScan,
  onError,
  fps = 15,
  qrbox = 250,
}: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [scanSuccess, setScanSuccess] = useState(false);

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.error("Gagal menghentikan scanner:", err);
    }
  }, []);

  const loadCameras = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        return devices;
      }
    } catch (err) {
      console.warn("Belum dapat mengambil daftar kamera:", err);
    }
    return [];
  }, []);

  const startScanner = useCallback(
    async (cameraIndex?: number) => {
      setIsStarted(true);
      setIsInitializing(true);
      setHasError(false);
      setErrorMessage("");
      setScanSuccess(false);
      isScanningRef.current = false;

      // Stop previous instance if any
      await stopScanner();

      try {
        // Fetch or use available cameras
        let devices = cameras;
        if (devices.length === 0) {
          devices = await loadCameras();
        }

        const activeIndex =
          typeof cameraIndex === "number" ? cameraIndex : currentCameraIndex;
        setCurrentCameraIndex(activeIndex);

        // Determine target camera: prefer specific camera ID, or facingMode fallback
        let targetCameraId;
        if (devices && devices.length > 0 && devices[activeIndex]?.id) {
          targetCameraId = devices[activeIndex].id;
        } else {
          targetCameraId = { facingMode: "environment" };
        }

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          targetCameraId,
          {
            fps: fps,
            qrbox: {
              width: qrbox,
              height: qrbox,
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isScanningRef.current) return;
            isScanningRef.current = true;

            // Haptic vibration feedback if available
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(100);
            }

            setScanSuccess(true);
            onScan(decodedText);
          },
          () => {
            // Normal scan frame without QR code detection
          }
        );

        setIsInitializing(false);

        // Check if torch / flashlight is supported
        try {
          const capabilities = scanner.getRunningTrackCapabilities() as any;
          if (capabilities && capabilities.torch) {
            setHasTorch(true);
          } else {
            setHasTorch(false);
          }
        } catch {
          setHasTorch(false);
        }
      } catch (err: any) {
        console.error("Scanner error:", err);
        setIsInitializing(false);
        setHasError(true);

        // Attempt to load cameras in case error happened during start
        loadCameras();

        let msg = "Gagal membuka kamera.";
        if (err?.name === "NotAllowedError" || err?.message?.includes("Permission")) {
          msg = "Izin akses kamera ditolak. Silakan berikan izin kamera di browser untuk memindai.";
        } else if (
          err?.name === "NotReadableError" ||
          err?.message?.includes("Could not start video source") ||
          err?.message?.includes("NotReadableError")
        ) {
          msg = "Kamera tidak dapat dimulai atau sedang digunakan aplikasi lain. Silakan coba ganti kamera lain di bawah.";
        } else if (err?.message) {
          msg = err.message;
        }

        setErrorMessage(msg);
        if (onError) onError(msg);
      }
    },
    [cameras, currentCameraIndex, fps, loadCameras, onScan, onError, qrbox, stopScanner]
  );

  const handleStop = async () => {
    await stopScanner();
    setIsStarted(false);
    setIsTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    try {
      const nextTorch = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch } as any],
      });
      setIsTorchOn(nextTorch);
    } catch (err) {
      console.error("Gagal mengubah status lampu senter:", err);
    }
  };

  const switchCamera = async (targetIndex?: number) => {
    let nextIndex: number;
    if (typeof targetIndex === "number") {
      nextIndex = targetIndex;
    } else {
      const total = cameras.length > 0 ? cameras.length : 2;
      nextIndex = (currentCameraIndex + 1) % total;
    }

    setCurrentCameraIndex(nextIndex);
    await startScanner(nextIndex);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCameras();

    return () => {
      stopScanner();
    };
  }, [loadCameras, stopScanner]);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
      {/* Scanner Box Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-neutral-950 border border-border/40 shadow-2xl flex items-center justify-center">
        {/* HTML5 QR Code Container (video element) */}
        <div
          id="qr-reader"
          className={cn(
            "w-full h-full object-cover",
            !isStarted && "hidden",
            "[&_#qr-reader]:border-none! [&_#qr-reader]:p-0!",
            "[&_#qr-reader__scan_region]:border-none! [&_#qr-reader__scan_region]:m-0!",
            "[&_#qr-reader__header_message]:hidden!",
            "[&_#qr-reader__status_span]:hidden!",
            "[&_#qr-reader__dashboard_section]:hidden!",
            "[&_#qr-shaded-region]:hidden!",
            "[&_video]:object-cover! [&_video]:w-full! [&_video]:h-full! [&_video]:rounded-3xl!"
          )}
        />

        {/* 1. INITIAL CONFIRMATION PROMPT (Before Camera is Opened) */}
        {!isStarted && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white bg-linear-to-b from-neutral-900/90 to-neutral-950/95">
            <h3 className="text-base font-bold text-white mb-1.5">
              Konfirmasi Akses Kamera
            </h3>

            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed mb-6">
              Aplikasi memerlukan izin untuk mengakses kamera perangkat Anda guna memindai QR Code transaksi warga.
            </p>

            <Button
              onClick={() => startScanner()}
              className="h-11 px-6 rounded-full font-semibold gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-transform"
            >
              <Camera className="size-4.5" />
              <span>Buka Kamera</span>
            </Button>
          </div>
        )}

        {/* 2. LOADING / INITIALIZING STATE */}
        {isStarted && isInitializing && !hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-neutral-950/90 backdrop-blur-md text-white p-6 text-center">
            <div className="relative flex items-center justify-center size-16 rounded-2xl">
              <Spinner className="absolute size-12 text-primary/40" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Menyiapkan Kamera...</h3>
            </div>
          </div>
        )}

        {/* 3. ERROR STATE (WITH CAMERA SWITCHING & RETRY OPTIONS) */}
        {isStarted && hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3.5 bg-neutral-950/95 p-6 text-center text-white overflow-y-auto">
            <div className="space-y-1 max-w-xs">
              <h3 className="font-semibold text-sm text-destructive-foreground">
                Kamera Tidak Dapat Diakses
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            {/* Camera Options when Error Occurs */}
            <div className="flex flex-col items-center gap-2 w-full max-w-xs pt-1">
              {/* Option to switch camera if multiple available or toggle */}
              <Button
                onClick={() => switchCamera()}
                variant="secondary"
                size="sm"
                className="w-full rounded-full gap-2 text-xs h-9 font-medium shadow-sm active:scale-95 transition-transform"
              >
                <SwitchCamera className="size-4 text-primary" />
                <span>
                  {cameras.length > 1
                    ? `Ganti Kamera (${(currentCameraIndex % cameras.length) + 1}/${cameras.length})`
                    : "Coba Ganti Sumber Kamera"}
                </span>
              </Button>

              <div className="grid grid-cols-2 items-center gap-2 w-full">
                <Button
                  onClick={() => startScanner(currentCameraIndex)}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs gap-1.5 h-9"
                >
                  <RefreshCw className="size-3.5" />
                  Coba Lagi
                </Button>

                <Button
                  onClick={() => setIsStarted(false)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs h-9 px-3"
                >
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4. SUCCESS SCAN FEEDBACK STATE */}
        {isStarted && scanSuccess && (
          <div className="absolute inset-0 z-25 flex flex-col items-center justify-center gap-3 bg-primary/90 backdrop-blur-sm text-primary-foreground p-6 text-center animate-in fade-in zoom-in duration-200">
            <CheckCircle2 className="size-16 animate-bounce" />
            <div className="space-y-1">
              <h3 className="font-bold text-base">QR Berhasil Dipindai!</h3>
              <p className="text-xs opacity-90">Memproses verifikasi token...</p>
            </div>
          </div>
        )}

        {/* 5. VIEWFINDER HUD (Active Camera Running, Clean Static Frame) */}
        {isStarted && !isInitializing && !hasError && !scanSuccess && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            {/* Central Target Square */}
            <div className="relative size-56 sm:size-64 flex items-center justify-center">
              {/* Four Corner Accents */}
              <div className="absolute -top-0.5 -left-0.5 size-7 border-t-4 border-l-4 rounded-tl-xl border-background" />
              <div className="absolute -top-0.5 -right-0.5 size-7 border-t-4 border-r-4 rounded-tr-xl border-background" />
              <div className="absolute -bottom-0.5 -left-0.5 size-7 border-b-4 border-l-4 rounded-bl-xl border-background" />
              <div className="absolute -bottom-0.5 -right-0.5 size-7 border-b-4 border-r-4 rounded-br-xl border-background" />
            </div>
          </div>
        )}

        {/* 6. TOP CONTROLS OVERLAY */}
        {isStarted && !isInitializing && !hasError && !scanSuccess && (
          <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-end">

            {/* Action buttons (Flashlight, Camera switch, Stop) */}
            <div className="flex items-center gap-2">
              {hasTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={cn(
                    "flex items-center justify-center size-9 rounded-full backdrop-blur-md border transition-all active:scale-90",
                    isTorchOn
                      ? "bg-amber-500 text-amber-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      : "bg-black/60 text-white border-white/10 hover:bg-black/80"
                  )}
                  title={isTorchOn ? "Matikan Lampu" : "Nyalakan Lampu"}
                >
                  {isTorchOn ? (
                    <Flashlight className="size-4.5 fill-current" />
                  ) : (
                    <FlashlightOff className="size-4.5" />
                  )}
                </button>
              )}

              {cameras.length > 1 && (
                <button
                  type="button"
                  onClick={() => switchCamera()}
                  className="flex items-center justify-center size-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
                  title="Ganti Kamera"
                >
                  <SwitchCamera className="size-4.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleStop}
                className="flex items-center justify-center size-9 rounded-full bg-black/60 hover:bg-destructive/80 backdrop-blur-md border border-white/10 hover:border-destructive text-white transition-all active:scale-90"
                title="Hentikan Kamera"
              >
                <Power className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* 7. BOTTOM HELPER PILL */}
        {isStarted && !isInitializing && !hasError && !scanSuccess && (
          <div className="absolute bottom-4 inset-x-4 z-20 flex justify-center">
            <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 text-xs text-neutral-200 font-medium text-center shadow-lg">
              Posisikan QR Code di dalam kotak
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
