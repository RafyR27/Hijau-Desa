"use client";

import instance from "@/lib/instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formAddSchema = z.object({
  namaProduct: z
    .string()
    .trim()
    .min(1, "Nama produk wajib diisi")
    .min(2, "Nama produk minimal 2 karakter"),
  hargaPoin: z
    .number("Harga poin wajib berupa angka")
    .min(1, "Harga poin wajib diisi dan tidak boleh negatif"),
  image: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type IFormAddProduct = z.infer<typeof formAddSchema>;

const useAddProduct = () => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormAddProduct>({
    resolver: zodResolver(formAddSchema),
    defaultValues: {
      namaProduct: "",
      hargaPoin: 0,
      image: "",
      isActive: true,
    },
  });

  const addProductService = async (payload: IFormAddProduct) => {
    let imageUrl = payload.image;

    // Jika gambar berupa data URL (base64 file upload), upload ke Cloudinary via /api/upload
    if (imageUrl && imageUrl.startsWith("data:image/")) {
      toast.info("Mengunggah gambar...", {
        position: "top-right",
      });
      const uploadRes = await instance.post("/admin/upload", {
        image: imageUrl,
        folder: "hijau-desa/products",
      });
      if (uploadRes.data?.data?.url) {
        imageUrl = uploadRes.data.data.url;
      }
    }

    const res = await instance.post("/admin/product", {
      ...payload,
      image: imageUrl,
    });
    return res.data;
  };

  const {
    mutate: mutateAddProduct,
    isPending: isPendingAddProduct,
    isSuccess: isSuccessAddProduct,
  } = useMutation({
    mutationFn: addProductService,
    onError(error) {
      toast.error( error?.message || "Gagal menambahkan produk", {
        position: "top-right"
      });
    },
    onSuccess() {
      toast.success("Berhasil menambahkan produk baru!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset({
        namaProduct: "",
        hargaPoin: 0,
        image: "",
        isActive: true,
      });
    },
  });

  const handleAddProduct = (data: IFormAddProduct) => mutateAddProduct(data);

  return {
    control,
    handleSubmit,
    handleAddProduct,
    isPendingAddProduct,
    isSuccessAddProduct,
    errors,
  };
};

export default useAddProduct;
