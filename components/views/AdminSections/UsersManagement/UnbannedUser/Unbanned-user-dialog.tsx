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
import { ProfileData } from "@/types/user";
import { TriangleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const UnbannedUserDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileData | null;
}) => {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const unbanUserService = async (id: string) => {
    await instance.patch(`/admin/user?id=${id}`, {
      status: "Aktif",
      alasan: "",
    });
  };

  const { mutate: mutateUnbanUser, isPending: isPendingUnban } = useMutation({
    mutationFn: unbanUserService,

    onError(error) {
      toast.error(error?.message || "Gagal membuka blokir akun user", {
        position: "top-right",
      });
    },

    onSuccess() {
      toast.success("Akun user berhasil dibuka blokir!", {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      onOpenChange(false);
      setName("");
    },
  });

  const handleUnbanUser = () => {
    if (user?.user?.id) {
      mutateUnbanUser(user.user.id);
    }
  };

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2">
            <TriangleAlert className="w-5 h-5" />
            Buka Blokir Pengguna
          </DialogTitle>

          <DialogDescription>
            Apakah kamu yakin ingin membuka blokir akun{" "}
            <span className="font-semibold">{user?.user?.name}</span>?
          </DialogDescription>

          <DialogDescription>
            Setelah blokir dibuka, akun dapat kembali digunakan.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="grid flex-1 gap-5">
          <Field orientation="horizontal" className="space-x-4">
            <Label htmlFor="name">Nama:</Label>

            <Input
              id="name"
              placeholder="Masukkan nama akun"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                className="p-4 cursor-pointer"
                variant="outline"
              >
                Tutup
              </Button>
            }
          />

          <Button
            type="button"
            className="p-4 md:w-30 w-full"
            onClick={handleUnbanUser}
            disabled={
              name.toLowerCase() !== user?.user?.name?.toLowerCase() ||
              isPendingUnban
            }
          >
            {isPendingUnban ? <Spinner /> : "Buka Blokir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnbannedUserDialog;
