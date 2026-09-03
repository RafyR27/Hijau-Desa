"use client";

import { CardKatalog } from "@/components/commons/CardKatalog/CardKatalog";
import { CardPoin } from "@/components/commons/CardPoin/CardPoin";
import { CardKatalogSkeleton } from "@/components/commons/CardSkeleton/CardSkeleton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import instance from "@/lib/instance";
import { KatalogItem } from "@/types/katalog";
import { SessionUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const KatalogLayout = ({ user }: { user?: SessionUser }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data = [], isLoading } = useQuery({
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

  return (
    <div className="mx-auto flex flex-col gap-7">
      <CardPoin user={user} saldo={data.saldo} />
      <InputGroup className="h-10">
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Cari barang untuk ditukar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map((item) => <CardKatalogSkeleton key={item} />)
        ) : data.product.length > 0 ? (
          data.product.map((item: KatalogItem) => (
            <CardKatalog
              key={item.id}
              name={item.namaProduct}
              image={item.image || "/garbage-can.webp"}
              poin={item.hargaPoin}
            />
          ))
        ) : (
          <div className="col-span-full py-30 text-center text-sm text-muted-foreground">
            Produk tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default KatalogLayout;
