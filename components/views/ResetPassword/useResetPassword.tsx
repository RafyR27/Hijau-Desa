import instance from "@/lib/instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formResetPasswordSchema = z
  .object({
    password: z
      .string("Password wajib diisi")
      .min(8, "Password harus memiliki minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung setidaknya satu angka")
      .regex(/^(?!.*\s).*$/, "Password tidak boleh mengandung spasi"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["confirmPassword"],
  });

export const useResetPassword = (token: string) => {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const toggleVisibilityConfirm = () => {
    setIsVisibleConfirm(!isVisibleConfirm);
  };

  const { control, handleSubmit } = useForm<
    z.infer<typeof formResetPasswordSchema>
  >({
    resolver: zodResolver(formResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordService = async (payload: {
    password: string;
    confirmPassword: string;
  }) => {
    await instance.post(`/general/reset-password?token=${token}`, {
      password: payload.password,
    });
  };

  const {
    mutate: mutateResetPassword,
    isPending: isPendingResetPassword,
    isSuccess: isSuccessResetPassword,
  } = useMutation({
    mutationFn: resetPasswordService,
    onError(error: Error) {
      toast.error(error?.message || "Terjadi kesalahan saat mereset password", {
        position: "top-right",
      });
    },

    onSuccess: () => {
      router.push("/auth?success=reset-password");
    },
  });

  const handleResetPassword = (payload: {
    password: string;
    confirmPassword: string;
  }) => mutateResetPassword(payload);

  return {
    control,
    handleSubmit,
    handleResetPassword,
    isPendingResetPassword,
    isSuccessResetPassword,
    isVisible,
    toggleVisibility,
    isVisibleConfirm,
    toggleVisibilityConfirm,
  };
};
