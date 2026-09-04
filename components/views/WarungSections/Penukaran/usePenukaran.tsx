"use client";

import instance from "@/lib/instance";
import { KatalogItem } from "@/types/katalog";
import { ProfileData } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
  item: KatalogItem;
  qty: number;
}

interface UsePenukaranProps {
  profile?: ProfileData;
  token?: string;
  wargaId?: string;
}

export const usePenukaran = ({
  profile,
  token,
  wargaId,
}: UsePenukaranProps = {}) => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data = { product: [] }, isLoading } = useQuery({
    queryKey: ["katalog", debouncedSearch],
    queryFn: async () => {
      const res = await instance.get("/general/katalog", {
        params: {
          search: debouncedSearch,
        },
      });
      return res.data.data;
    },
  });

  const toggleProduct = (product: KatalogItem) => {
    setCart((prev) => {
      const exists = prev.some((cartItem) => cartItem.item.id === product.id);

      if (exists) {
        return prev.filter((cartItem) => cartItem.item.id !== product.id);
      }
      return [
        ...prev,
        {
          item: product,
          qty: 1,
        },
      ];
    });
  };

  const isProductSelected = (productId: string | number): boolean => {
    const exists = cart.some((cartItem) => cartItem.item.id === productId);

    if (exists) {
      return true;
    }

    return false;
  };

  const cartList = useMemo(() => Object.values(cart), [cart]);

  const totalItems = useMemo(() => cartList.length, [cartList]);

  const totalPoin = useMemo(
    () => cartList.reduce((acc, curr) => acc + curr.item.hargaPoin, 0),
    [cartList],
  );

  const userSaldo = profile?.poin?.saldo ?? 0;
  const isPoinCukup = userSaldo >= totalPoin;
  const isCartEmpty = cartList.length === 0;

  const simpanTukar = async () => {
    const response = await instance.post("/warung/tukar", {
      wargaId,
      token,
      items: cart,
    });

    return response.data;
  };

  // Mutation to save weighing transaction
  const {
    mutate: mutateSimpanTukar,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: simpanTukar,
    onSuccess: (data) => {

      console.log(data)

      router.push(
        `/warung/success?token=${token}&wargaId=${wargaId}&transaksiId=${data.data.transaksiId}`,
      );
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menyimpan tukar poin.", {
        position: "top-right",
      });

      router.push("/warung/scan");
    },
  });

  const handleSimpanTukar = () => mutateSimpanTukar();

  return {
    search,
    setSearch,
    debouncedSearch,
    katalogData: data,
    isLoading,
    cart,
    cartList,
    totalItems,
    totalPoin,
    userSaldo,
    isPoinCukup,
    isCartEmpty,
    toggleProduct,
    isProductSelected,
    handleSimpanTukar,
    isPending,
    isSuccess,
  };
};
