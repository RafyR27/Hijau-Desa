
import { SuccessAnimationPenukaran } from "@/components/commons/SuccessAnimation/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { TransaksiTukar } from "@/types/transaksiTukar";
import Link from "next/link";

const WarungSuccess = ({ transaksi }: { transaksi: TransaksiTukar }) => {
  return (
    <div className="w-full min-h-screen bg-secondary/15">
      <div className="w-full max-w-2xl min-h-screen mx-auto flex flex-col md:justify-center">
        {/* Success Illustration */}
        <div className="w-full flex-1 md:flex-0 flex items-center justify-center">
          <SuccessAnimationPenukaran />
        </div>

        <div className="w-full min-h-[70vh] md:min-h-[50vh] bg-background rounded-t-[2.5rem] md:rounded-[2.5rem] px-8 flex flex-col justify-between items-center py-5">
          {/* Transaction Detail */}
          <div className="w-full bg-card overflow-hidden">
            <div className="border-b border-border pb-4 text-center space-y-3">
              <h2 className="font-light">Penukaran Berhasil</h2>
              <h1 className="font-extrabold text-3xl">
                -{transaksi.totalPoin} poin
              </h1>
              <p className="font-light text-sm">
                Poin berhasil ditukarkan dengan barang
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <p className="text-sm font-bold uppercase tracking-wide">
                Detail Penukaran
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Warga</span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {transaksi.namaWarga}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Barang</span>

                <div className="w-full overflow-hidden rounded-lg border divide-y">
                  {transaksi?.product?.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium max-w-80 truncate">
                          {item.namaProduct}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          x {item.qty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Poin
                </span>
                <span className="text-sm font-semibold max-w-40 truncate">
                  {transaksi.totalPoin} Poin
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
              render={<Link href={"/warung/dashboard"} />}
            >
              Selesai
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarungSuccess;
