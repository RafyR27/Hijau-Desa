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
    const avatars = [
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_3_ytpno7.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872500/Frame_1_f9xwi8.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_8_iw25wl.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_4_nphnrx.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_5_gwugdj.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872500/Frame_7_c1cmce.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_9_mwwzrw.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_10_x5zu4p.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_6_yme7xa.png",
      "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_2_uypphe.png",
    ];

    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

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

  const {
    mutate: mutateRegister,
    isPending: isPendingRegister,
    isSuccess: isSuccessRegister,
  } = useMutation({
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
    isSuccessRegister,
    isPendingRegister,
  };
};
