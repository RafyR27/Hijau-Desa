import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import instance from "@/lib/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";

const EditKonfigurasiDialog = ({
  open,
  onOpenChange,
  konfigurasi,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  konfigurasi: {
    id: number;
    ratePoinKeRupiah: string;
  };
}) => {
  const queryClient = useQueryClient();

  const editKonfigurasi = async (id: number) => {
    await instance.patch(`/admin/konfigurasi?id=${id}`, {
      ratePoinKeRupiah: Number(konfigurasi.ratePoinKeRupiah),
    });
  };

  const { mutate: mutateEditKonfigurasi, isPending } = useMutation({
    mutationFn: editKonfigurasi,
    onError(error: Error) {
      toast.error(
        error?.message ||
          "Terjadi kesalahan saat merubah konfigurasi",
        {
          position: "top-right",
        },
      );
    },

    onSuccess: () => {
      toast.success("Berhasil merubah konfigurasi", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["konfigurasi"],
      });
      onOpenChange(false);
    },
  });

  const handleEditKonfigurasi = (id: number) => mutateEditKonfigurasi(id);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pb-2">
              <CircleCheck className="h-5 w-5" />
              Konfirmasi Perubahan Nilai Konversi
            </DialogTitle>

            <DialogDescription>
              Apakah kamu yakin ingin mengubah nilai 1 poin menjadi{" "}
              <span className="font-semibold">
                Rp{" "}
                {Number(konfigurasi.ratePoinKeRupiah).toLocaleString("id-ID")}
              </span>
              ?
            </DialogDescription>

            <DialogDescription>
              Nilai baru ini akan digunakan untuk menghitung nominal Rupiah pada
              reimbursement yang dibuat setelah perubahan. Reimbursement yang
              sudah diajukan sebelumnya tetap menggunakan nilai konversi saat
              pengajuan dibuat.
            </DialogDescription>

            <DialogDescription>
              Perubahan ini juga akan diberitahukan kepada{" "}
              <span className="font-semibold">seluruh pengguna</span> melalui
              notifikasi sistem.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isPending}
                >
                  Batal
                </Button>
              }
            />

            <Button
              type="button"
              className="w-full md:w-40"
              onClick={() => handleEditKonfigurasi(konfigurasi.id)}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Simpan perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </>
  );
};

export default EditKonfigurasiDialog;
