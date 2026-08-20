import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { IRegister } from "@/types/user";
import { useState } from "react";

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

    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const { control, handleSubmit, reset, setError } = useForm<
      z.infer<typeof formRegisterSchema>
    >({
      resolver: zodResolver(formRegisterSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    });

    const registerService = async (payload: IRegister) => {
      console.log(payload);
    };

    const { mutate: mutateRegister, isPending: isPendingRegister } =
      useMutation({
        mutationFn: registerService,
        onError(error: Error) {
          setError("root", {
            message: error?.message || "Terjadi kesalahan",
          });
          // sonner alert error disini
        },

        onSuccess: () => {
          // sonner alert success disini

          reset({
            name: "",
            email: "",
            password: "",
          });
        },
      });

    const handleStepOne = (payload: IRegister) => mutateRegister(payload);

    return {
      handleShowPassword,
      showPassword,
      control,
      handleSubmit,
      handleStepOne,
      isPendingRegister,
    };
};
