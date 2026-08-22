import instance from "@/lib/instance";
import { IEditProfile, SessionUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formEditProfileSchema = z.object({
  name: z
    .string("Nama wajib diisi")
    .trim()
    .min(5, "Nama harus memiliki minimal 5 karakter")
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh mengandung huruf"),

  noHP: z
    .string()
    .trim()
    .min(1, "Nomor handphone wajib diisi")
    .regex(
      /^08\d{8,12}$/,
      "Nomor handphone harus diawali 08 dan terdiri dari 10–14 digit",
    ),

  noRumah: z
    .string()
    .trim()
    .min(1, "Nomor rumah wajib diisi")
    .max(20, "Nomor rumah maksimal 20 karakter"),
});

export const useProfileEdit = ({ user }: { user?: SessionUser }) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<z.infer<typeof formEditProfileSchema>>({
    resolver: zodResolver(formEditProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      noHP: user?.noHP ?? "",
      noRumah: user?.noRumah ?? "",
    },
  });

  const updateService = async (payload: IEditProfile) => {
    await instance.patch("/general/edit-profile", payload);
  };

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: updateService,
    onError(error: Error) {
      toast.error(error?.message, {
        position: "top-right",
      });
    },

    onSuccess: () => {
      //   ;
    },
  });

  const handleUpdate = (payload: IEditProfile) => mutateUpdate(payload);

  return {
    control,
    handleSubmit,
    isPendingUpdate,
    handleUpdate,
    isDirty,
    reset,
  };
};
