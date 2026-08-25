"use client"

import { useQuery } from "@tanstack/react-query";
import { RiwayatFilter } from "@/types/riwayat";
import instance from "@/lib/instance";

interface UseRiwayatParams {
  filter?: RiwayatFilter;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export function useRiwayat({
  filter = "all",
  startDate,
  endDate,
  limit = 10,
}: UseRiwayatParams = {}) {
  const { data: riwayat, isLoading: isLoadingRiwayat } = useQuery({
    queryKey: [
      "riwayat",
      {
        filter,
        startDate,
        endDate,
        limit,
      },
    ],

    queryFn: async () => {
      const res = await instance.get("/general/riwayat", {
        params: {
          filter,
          startDate,
          endDate,
          limit,
        },
      });

      return res.data.data;
    },
  });

  return {
    riwayat,
    isLoadingRiwayat,
  };
}
