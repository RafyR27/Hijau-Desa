import instance from "@/lib/instance";
import { ICompleteProfile } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const formCompleteProfileSchema = z.object({
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

export const useCompleteProfile = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
  } = useForm<z.infer<typeof formCompleteProfileSchema>>({
    resolver: zodResolver(formCompleteProfileSchema),
    defaultValues: {
      noHP: "",
      noRumah: "",
    },
  });

  const updateService = async (payload: ICompleteProfile) => {
    await instance.patch("/general/complete-profile", payload)
  };

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: updateService,
    onError(error: Error) {
      toast.error(error?.message, {
        position: "top-right",
      });
    },

    onSuccess: () => {
      router.push("/warga/dashboard");
    },
  });

  const handleUpdate = (payload: ICompleteProfile) => mutateUpdate(payload);

  return {
    control,
    handleSubmit,
    isPendingUpdate,
    handleUpdate,
  };
};
