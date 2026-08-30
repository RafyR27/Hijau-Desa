"use client";

import instance from "@/lib/instance";
import { KatalogItem } from "@/types/katalog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formEditSchema = z.object({
  id: z.union([z.number(), z.string()]),
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

export type IFormEditProduct = z.infer<typeof formEditSchema>;

const useEditProduct = ({ product }: { product: KatalogItem | null }) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormEditProduct>({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      id: product?.id ?? 0,
      namaProduct: product?.namaProduct ?? "",
      hargaPoin: product?.hargaPoin ?? 0,
      image: product?.image ?? "",
      isActive: product?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        id: product.id,
        namaProduct: product.namaProduct,
        hargaPoin: product.hargaPoin,
        image: product.image ?? "",
        isActive: product.isActive,
      });
    }
  }, [product, reset]);

  const editProductService = async (payload: IFormEditProduct) => {
    let imageUrl = payload.image;

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

    const res = await instance.patch("/admin/product", {
      ...payload,
      image: imageUrl,
    });
    return res.data;
  };

  const {
    mutate: mutateEditProduct,
    isPending: isPendingEditProduct,
    isSuccess: isSuccessEditProduct,
  } = useMutation({
    mutationFn: editProductService,
    onError(error) {
      toast.error(error?.message || "Gagal mengedit produk", {
        position: "top-right",
      });
    },
    onSuccess() {
      toast.success("Berhasil memperbarui data produk!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleEditProduct = (data: IFormEditProduct) => mutateEditProduct(data);

  return {
    control,
    handleSubmit,
    handleEditProduct,
    isPendingEditProduct,
    isSuccessEditProduct,
    errors,
  };
};

export default useEditProduct;
