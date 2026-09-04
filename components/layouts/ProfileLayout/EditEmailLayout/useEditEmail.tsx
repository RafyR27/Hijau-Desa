import instance from "@/lib/instance";
import { SessionUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formEditEmailSchema = z.object({
  newEmail: z.email("Email baru wajib diisi").trim().toLowerCase()
});

type EditEmailPayload = z.infer<typeof formEditEmailSchema>;

export const useEditEmail = ({ user }: { user?: SessionUser }) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<EditEmailPayload>({
    resolver: zodResolver(formEditEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const newEmailValue = useWatch({
    control,
    name: "newEmail",
  });

  const isSameEmail =
    newEmailValue?.trim().toLowerCase() === user?.email?.toLowerCase();

  const updateEmailService = async (payload: EditEmailPayload) => {
    await instance.patch("/general/edit-email", payload);
  };

  const { mutate: mutateUpdateEmail, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: updateEmailService,
      onError(error: Error) {
        toast.error(error?.message, {
          position: "top-right",
        });
      },
      onSuccess: () => {
        toast.success("Email berhasil diperbarui", {
          position: "top-right",
        });
        router.back();
      },
    });

  const handleUpdateEmail = (payload: EditEmailPayload) =>
    mutateUpdateEmail(payload);

  return {
    control,
    handleSubmit,
    isPendingUpdate,
    handleUpdateEmail,
    isDirty,
    isSameEmail,
  };
};
