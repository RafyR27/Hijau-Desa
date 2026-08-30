"use client";

import VerifikasiTable from "./VerifikasiTable/VerifikasiTable";

export default function VerifikasiWargaView() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Verifikasi Warga
              </h2>
              <p className="text-sm text-muted-foreground">
                Persetujuan pendaftaran akun warga baru untuk mengakses fitur
                bank sampah.
              </p>
            </div>
          </div>

          <VerifikasiTable />
        </div>
      </div>
    </div>
  );
}
