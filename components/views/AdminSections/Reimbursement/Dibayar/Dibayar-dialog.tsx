import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import instance from "@/lib/instance";
import { ReimbursementItem } from "@/types/reimbursement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";

const DibayarDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ReimbursementItem;
}) => {
  const queryClient = useQueryClient();

  const dibayar = async (id: number) => {
    await instance.patch(`/admin/reimbursement?id=${id}`);
  };

  const { mutate: mutateDibayar, isPending } = useMutation({
    mutationFn: dibayar,
    onError(error: Error) {
      toast.error(
        error?.message ||
          "Terjadi kesalahan saat merubah status data pencairan",
        {
          position: "top-right",
        },
      );
    },

    onSuccess: () => {
      toast.success("Berhasil merubah status data pencairan", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["reimbursements"],
      });
      onOpenChange(false);
    },
  });

  const handleDibayar = (id: number) => mutateDibayar(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2">
            <CircleCheck className="h-5 w-5" />
            Konfirmasi Pembayaran
          </DialogTitle>

          <DialogDescription>
            Apakah kamu yakin ingin menandai reimbursement dari{" "}
            <span className="font-semibold">{user?.owner}</span>{" "}
            sebagai selesai dibayar?
          </DialogDescription>

          <DialogDescription>
            Setelah dikonfirmasi, status reimbursement akan diubah menjadi{" "}
            <span className="font-semibold">Selesai Dibayar</span> dan tidak
            dapat diproses kembali.
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
            onClick={() => handleDibayar(user.id)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Selesai dibayar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DibayarDialog;
