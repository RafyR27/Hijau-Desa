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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const banReasons = [
  {
    value: "data-palsu",
    label: "Data identitas tidak valid",
  },
  {
    value: "akun-ganda",
    label: "Memiliki akun ganda",
  },
  {
    value: "penyalahgunaan-poin",
    label: "Penyalahgunaan sistem poin",
  },
  {
    value: "manipulasi-transaksi",
    label: "Manipulasi transaksi",
  },
  {
    value: "penipuan",
    label: "Melakukan penipuan",
  },
  {
    value: "spam",
    label: "Spam atau aktivitas berlebihan",
  },
  {
    value: "pelanggaran-ketentuan",
    label: "Pelanggaran ketentuan layanan",
  },
];

const BannedUserDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileData | null;
}) => {
  const [name, setName] = useState("");
  const [alasan, setAlasan] = useState("");

  const queryClient = useQueryClient();

  const banUserService = async (id: string) => {
    await instance.patch(`/admin/user?id=${id}`, {
      status: "Diblokir",
      alasan: alasan,
    });
  };

  const { mutate: mutateBanUser, isPending: isPendingBan } = useMutation({
    mutationFn: banUserService,
    onError(error) {
      toast.error(error?.message || "Gagal memblokir akun user", {
        position: "top-right",
      });
    },
    onSuccess() {
      toast.success("Akun user berhasil diblokir!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onOpenChange(false);
      setName("");
      setAlasan("");
    },
  });

  const handleDeleteUser = () => {
    if (user?.user?.id) {
      mutateBanUser(user?.user?.id);
    }
  };

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAlasan("");
      setName("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2 text-destructive">
            <TriangleAlert className="w-5 h-5" />
            Blokir Pengguna
          </DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin memblokir akun{" "}
            <span className="font-semibold">{user?.user?.name}</span>?
          </DialogDescription>

          <DialogDescription>
            Akun yang diblokir tidak dapat digunakan dan poin tidak dapat
            ditukarkan.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="grid flex-1 gap-5">
          <Field orientation="horizontal" className="space-x-4">
            <Label htmlFor="name">Nama:</Label>
            <Input
              id="name"
              placeholder="Masukan nama akun"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field orientation="horizontal" className="space-x-3.5">
            <Label htmlFor="ban-reason">Alasan:</Label>

            <Select
              items={banReasons}
              value={alasan}
              onValueChange={(value) => setAlasan(value ?? "")}
            >
              <SelectTrigger
                id="ban-reason"
                className="w-full mx-0 bg-input/30 py-4"
              >
                <SelectValue placeholder="Pilih alasan" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Alasan Ban</SelectLabel>

                  {banReasons.map((reason) => (
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
                className="p-4 cursor-pointer"
                variant="outline"
              >
                Tutup
              </Button>
            }
          />
          <Button
            type="button"
            className="p-4 md:w-35 w-full"
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={
              name.toLocaleLowerCase() !== user?.user?.name?.toLowerCase() ||
              !alasan ||
              isPendingBan
            }
          >
            {isPendingBan ? <Spinner /> : "Blokir Pengguna"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BannedUserDialog;
