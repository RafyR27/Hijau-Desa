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
import { VerifWarga } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";

const VerifWargaDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: VerifWarga;
}) => {
  const queryClient = useQueryClient();

  const verifWarga = async (id: string) => {
    await instance.patch(`/admin/verif-warga?id=${id}`, {
      status: "Terima",
    });
  };

  const {
    mutate: mutateVerifWarga,
    isPending,
  } = useMutation({
    mutationFn: verifWarga,
    onError(error: Error) {
      toast.error(
        error?.message || "Terjadi kesalahan saat memverifikasi warga",
        {
          position: "top-right",
        },
      );
    },

    onSuccess: () => {
      toast.success("Berhasil memverifikasi warga", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["verif-warga"],
      });
      onOpenChange(false);
    },
  });

  const handleVerifWarga = (id: string) => mutateVerifWarga(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2">
            <CircleCheck className="h-5 w-5" />
            Verifikasi Warga
          </DialogTitle>

          <DialogDescription>
            Apakah kamu yakin ingin memverifikasi warga{" "}
            <span className="font-semibold">{user?.name}</span>?
          </DialogDescription>

          <DialogDescription>
            Setelah diverifikasi, warga dapat menggunakan akun dan mengakses
            fitur yang tersedia.
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
            className="w-full md:w-35"
            onClick={() => handleVerifWarga(user.id)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Verifikasi Warga"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifWargaDialog;
