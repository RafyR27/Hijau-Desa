import SuccessAnimation from "@/components/commons/SuccessAnimation/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { TransaksiSetor } from "@/types/transaksiSetor";
import Link from "next/link";

const PetugasSuccess = ({ transaksi }: { transaksi: TransaksiSetor }) => {
  return (
    <div className="w-full min-h-screen bg-secondary/15">
      <div className="w-full max-w-2xl h-screen mx-auto flex flex-col md:justify-center">
        {/* Success Illustration */}
        <div className="w-full flex-1 md:flex-0 flex items-center justify-center">
          <SuccessAnimation />
        </div>

        <div className="w-full min-h-[70vh] md:min-h-[50vh] bg-background rounded-t-[2.5rem] md:rounded-[2.5rem] px-8 flex flex-col justify-between items-center py-5">
          {/* Transaction Detail */}
          <div className="w-full bg-card overflow-hidden">
            <div className="border-b border-border pb-4 text-center space-y-3">
              <h2 className="font-light">Berhasil Menambahkan</h2>
              <h1 className="font-extrabold text-3xl">
                +{transaksi.totalPoin} poin
              </h1>
              <p className="font-light text-sm">
                Poin berhasil ditambahkan ke saldo warga
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <p className="text-sm font-bold uppercase tracking-wide">
                Detail Penimbangan
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Warga</span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {transaksi.namaWarga}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kategori</span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {transaksi.kategoriSampah}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Berat</span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {transaksi.beratSampah} Kg
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rate</span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {transaksi.rate} Poin/kg
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tanggal</span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {new Date(transaksi.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          {/* Bottom Action */}
          <div className="w-full mt-10">
            <Button
              nativeButton={false}
              type="button"
              className="w-full h-12 rounded-xl"
              render={<Link href={"/petugas/dashboard"} />}
            >
              Selesai
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetugasSuccess;
