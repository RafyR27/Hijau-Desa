import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { IRegister } from "@/types/user";
import { useState } from "react";
import environment from "@/config/environment";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formRegisterSchema = z.object({
  name: z
    .string("Nama wajib diisi")
    .trim()
    .min(5, "Nama harus memiliki minimal 5 karakter")
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh mengandung huruf"),

  email: z.email("Email wajib diisi").trim().toLowerCase(),

  password: z
    .string("Password wajib diisi")
    .min(8, "Password harus memiliki minimal 8 karakter")
    .regex(/[0-9]/, "Password harus mengandung setidaknya satu angka")
    .regex(/^(?!.*\s).*$/, "Password tidak boleh mengandung spasi"),
});

export const useRegisterEmail = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const callbackURL = `${environment.BETTER_AUTH_URL}/warga/dashboard`;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { control, handleSubmit } = useForm<z.infer<typeof formRegisterSchema>>(
    {
      resolver: zodResolver(formRegisterSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    },
  );

  const registerService = async (payload: IRegister) => {
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      payload.name,
    )}&background=random`;

    const { data, error } = await signUp.email({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      image: avatar,
    });

    if (error) {
      throw new Error(error.message || "Terjadi kesalahan saat mendaftar");
    }

    return data;
  };

  const { mutate: mutateRegister, isPending: isPendingRegister } = useMutation({
    mutationFn: registerService,
    onError(error: Error) {
      toast.error(error?.message || "Terjadi kesalahan saat mendaftar", {
        position: "top-right",
      });
    },

    onSuccess: () => {
      router.push(callbackURL);
    },
  });

  const handleRegister = (payload: IRegister) => mutateRegister(payload);

  return {
    handleShowPassword,
    showPassword,
    control,
    handleSubmit,
    handleRegister,
    isPendingRegister,
  };
};
