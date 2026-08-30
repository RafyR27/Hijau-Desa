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
import { KatalogItem } from "@/types/katalog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: KatalogItem | null;
}

const DeleteProductDialog = ({
  open,
  onOpenChange,
  product,
}: DeleteProductDialogProps) => {
  const queryClient = useQueryClient();

  const deleteProductService = async (id: number | string) => {
    const res = await instance.delete(`/admin/product?id=${id}`);
    return res.data;
  };

  const { mutate: mutateDeleteProduct, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteProductService,
    onError(error) {
      toast.error(error?.message || "Gagal menghapus produk", {
        position: "top-right",
      });
    },
    onSuccess() {
      toast.success("Produk berhasil dihapus!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    if (product?.id) {
      mutateDeleteProduct(product.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2 text-destructive">
            <TriangleAlert className="w-5 h-5" />
            Hapus Produk
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus produk{" "}
            <span className="font-semibold text-foreground">
              {product?.namaProduct}
            </span>
            ?
          </DialogDescription>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Produk ini akan dihapus secara
            permanen dari katalog.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col text-sm text-destructive border rounded-lg p-4 border-destructive/30 bg-destructive/5">
          <p className="font-medium">Peringatan!</p>
          <p className="text-xs mt-0.5">
            Harap berhati-hati, menghapus produk yang sedang digunakan transaksi
            mungkin gagal atau berdampak pada data transaksi.
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
            className="md:w-30 w-full"
          >
            {isPendingDelete ? <Spinner /> : "Hapus Produk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
