import { requestPasswordReset, signOut } from "@/lib/auth-client";
import instance from "@/lib/instance";
import { ISetPassword, SessionUser, UserSecurityInfo } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const formSetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password baru wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
      .regex(/^(?!.*\s).*$/, "Password tidak boleh mengandung spasi"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type FormSetPasswordValues = z.infer<typeof formSetPasswordSchema>;

export const useProfileKeamanan = ({ user }: { user?: SessionUser }) => {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormSetPasswordValues>({
    resolver: zodResolver(formSetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Query security details
  const {
    data: securityData,
    isLoading: isLoadingSecurity,
    refetch: refetchSecurity,
  } = useQuery<UserSecurityInfo>({
    queryKey: ["user-security"],
    queryFn: async () => {
      const response = await instance.get("/general/security");
      return response.data?.data;
    },
  });

  // Mutation: Set Password (for Google/OAuth users)
  const setPasswordService = async (payload: ISetPassword) => {
    const response = await instance.post("/general/set-password", payload);
    return response.data;
  };

  const { mutate: mutateSetPassword, isPending: isPendingSetPassword } =
    useMutation({
      mutationFn: setPasswordService,
      onError() {
        toast.error("Gagal membuat password", {
          position: "top-right",
        });
      },
      onSuccess: () => {
        toast.success("Password baru berhasil dibuat dan disimpan!", {
          position: "top-right",
        });
        reset();
        queryClient.invalidateQueries({ queryKey: ["user-security"] });
      },
    });

  const resetPasswordService = async () => {
    const email = user?.email || securityData?.email;
    if (!email) {
      throw new Error("Email tidak ditemukan");
    }

    const { data, error } = await requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const {
    mutate: mutateResetPassword,
    isPending: isPendingResetPassword,
    isSuccess: isSuccessResetPassword,
  } = useMutation({
    mutationFn: resetPasswordService,
    onError() {
      toast.error("Gagal mengirim link reset password", {
        position: "top-right",
      });
    },
    onSuccess: async () => {
      await signOut();

      toast.success("Instruksi reset password telah dikirim ke email Anda.", {
        position: "top-right",
      });
    },
  });

  const handleSetPassword = (payload: FormSetPasswordValues) => {
    mutateSetPassword(payload);
  };

  const handleResetPassword = () => {
    mutateResetPassword();
  };

  return {
    control,
    handleSubmit,
    handleSetPassword,
    handleResetPassword,
    isPendingSetPassword,
    isPendingResetPassword,
    isLoadingSecurity,
    securityData,
    refetchSecurity,
    isDirty,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSuccessResetPassword,
  };
};
