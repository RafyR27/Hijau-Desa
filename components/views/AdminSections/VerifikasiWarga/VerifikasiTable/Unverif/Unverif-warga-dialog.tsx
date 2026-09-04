"use client"

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
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import instance from "@/lib/instance";
import { VerifWarga } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const rejectionReasons = [
  {
    value: "Data identitas tidak sesuai",
    label: "Data identitas tidak sesuai",
  },
  {
    value: "Nomor rumah tidak sesuai",
    label: "Nomor rumah tidak sesuai",
  },
  {
    value: "Nomor HP tidak valid",
    label: "Nomor HP tidak valid",
  },
];

const UnverifWargaDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: VerifWarga;
}) => {
  const [alasan, setAlasan] = useState("");

  const queryClient = useQueryClient();

  const unverifWarga = async (id: string) => {
    await instance.patch(`/admin/verif-warga?id=${id}`, {
      status: "Tolak",
      alasan: alasan,
    });
  };

  const { mutate: mutateUnverifWarga, isPending } = useMutation({
    mutationFn: unverifWarga,
    onError(error: Error) {
      toast.error(
        error?.message || "Terjadi kesalahan saat memverifikasi warga",
        {
          position: "top-right",
        },
      );
    },

    onSuccess: () => {
      toast.success("Berhasil menolak warga", {
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["verif-warga"],
      });

      onOpenChange(false)
    },
  });

  const handleUnverifWarga = (id: string) => mutateUnverifWarga(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2 text-destructive">
            <TriangleAlert className="h-5 w-5" />
            Tolak Verifikasi Warga
          </DialogTitle>

          <DialogDescription>
            Apakah kamu yakin ingin menolak verifikasi warga{" "}
            <span className="font-semibold">{user?.name}</span>?
          </DialogDescription>

          <DialogDescription>
            Warga yang ditolak perlu memperbaiki data dan mengajukan verifikasi
            kembali sebelum dapat menggunakan layanan.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="grid flex-1 gap-5">
          <Field orientation="horizontal" className="space-x-4">
            <Label htmlFor="rejection-reason">Alasan:</Label>

            <Select
              items={rejectionReasons}
              value={alasan}
              onValueChange={(value) => setAlasan(value ?? "")}
            >
              <SelectTrigger
                id="rejection-reason"
                className="w-full bg-input/30 py-4 mr-0"
              >
                <SelectValue placeholder="Pilih alasan penolakan" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Alasan Penolakan</SelectLabel>

                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

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
            variant="destructive"
            className="w-full md:w-35"
            onClick={() => handleUnverifWarga(user.id)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Tolak Verifikasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnverifWargaDialog;
