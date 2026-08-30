"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import instance from "@/lib/instance";
import { KategoriItem } from "@/types/kategori";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";

interface DeleteKategoriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kategori: KategoriItem | null;
}

const DeleteKategoriDialog = ({
  open,
  onOpenChange,
  kategori,
}: DeleteKategoriDialogProps) => {
  const queryClient = useQueryClient();

  const deleteKategoriService = async (id: number | string) => {
    await instance.delete(`/admin/kategori?id=${id}`)
  };

  const { mutate: mutateDeleteKategori, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteKategoriService,
    onError(error) {
      toast.error(error?.message || "Gagal menghapus kategori", {
        position: "top-right"
      });
    },
    onSuccess() {
      toast.success("Kategori sampah berhasil dihapus!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    if (kategori?.id) {
      mutateDeleteKategori(kategori.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2 text-destructive">
            <TriangleAlert className="w-5 h-5" />
            Hapus Kategori Sampah
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus kategori{" "}
            <span className="font-semibold text-foreground">
              {kategori?.namaKategori}
            </span>
            ?
          </DialogDescription>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Kategori ini akan dihapus
            secara permanen dari sistem.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col text-sm text-destructive border rounded-lg p-4 border-destructive/30 bg-destructive/5">
          <p className="font-medium">Peringatan!</p>
          <p className="text-xs mt-0.5">
            Kategori yang sudah digunakan dalam transaksi tidak dapat dihapus.
            Pastikan kategori ini belum digunakan sebelum melanjutkan.
          </p>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isPendingDelete}
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPendingDelete}
            className="md:w-35 w-full"
          >
            {isPendingDelete ? <Spinner /> : "Hapus Kategori"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteKategoriDialog;
