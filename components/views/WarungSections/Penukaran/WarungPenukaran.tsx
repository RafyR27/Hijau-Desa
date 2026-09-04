"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { KatalogItem } from "@/types/katalog";
import { ProfileData } from "@/types/user";
import { Check, CircleStar, Plus, Search } from "lucide-react";
import Image from "next/image";
import { usePenukaran } from "./usePenukaran";
import { Spinner } from "@/components/ui/spinner";

interface WarungPenukaranProps {
  profile?: ProfileData;
  token?: string;
  wargaId?: string;
}

const WarungPenukaran = ({ profile, token, wargaId }: WarungPenukaranProps) => {
  const {
    search,
    setSearch,
    katalogData,
    isLoading,
    totalItems,
    totalPoin,
    isPoinCukup,
    isCartEmpty,
    toggleProduct,
    isProductSelected,
    handleSimpanTukar,
    isPending,
    isSuccess,
  } = usePenukaran({ profile, token, wargaId });

  const userName = profile?.user?.name || "Warga";
  const userImage =
    profile?.user?.image ||
    "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_3_ytpno7.png";

  const products = katalogData?.product || [];

  return (
    <div className="mx-auto flex flex-col gap-5 py-2 relative">
      <div className="w-full rounded-2xl border border-border/70 bg-card p-4 shadow-xs flex items-center gap-4">
        <Avatar
          size="lg"
          className="size-13 sm:size-14 border border-border/40 shrink-0"
        >
          <AvatarImage
            src={userImage}
            alt={userName}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
            {userName ? userName.substring(0, 2).toUpperCase() : "WG"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 justify-center gap-1">
          <h2 className="font-bold text-base sm:text-lg text-foreground truncate leading-snug">
            {userName}
          </h2>

          <p className="text-[1.1rem] font-bold truncate flex items-center gap-2 text-primary">
            <CircleStar className="size-5.5 shrink-0" strokeWidth={1.8} />
            {profile?.poin?.saldo?.toLocaleString("id-ID") || 0}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-35 md:mb-10">
        <h2 className="font-bold">Katalog Produk</h2>
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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {isLoading ? (
            [1, 2, 3, 4].map((item) => <div key={item}></div>)
          ) : products.length > 0 ? (
            products.map((item: KatalogItem) => {
              const selected = isProductSelected(item.id);

              return (
                <Card
                  key={item.id}
                  className={`rounded-xl py-0 shadow-sm flex flex-row gap-0 transition-all ${
                    selected
                      ? "border-primary/60 bg-primary/3 ring-1 ring-primary/20"
                      : ""
                  }`}
                >
                  <div className="relative aspect-square w-20 h-20 m-3 shrink-0">
                    <Image
                      src={
                        item.image ||
                        "https://res.cloudinary.com/dejhqj1te/image/upload/v1787953889/no-image_skmrix.jpg"
                      }
                      alt={item.namaProduct}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <CardContent className="flex flex-1 flex-col justify-between px-2 py-3 min-w-0">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium leading-5 max-w-50 truncate">
                        {item.namaProduct}
                      </h3>

                      <p className="text-sm font-semibold text-orange-500">
                        {item.hargaPoin} Poin
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="icon-sm"
                      variant={selected ? "default" : "outline"}
                      className={`rounded-full self-end cursor-pointer transition-all ${
                        selected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleProduct(item)}
                    >
                      {selected ? (
                        <Check className="size-4 stroke-[2.5]" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-30 text-center text-sm text-muted-foreground">
              Produk tidak ditemukan.
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-background fixed md:static flex flex-col bottom-0 right-0 py-3 px-5 drop-shadow-2xl md:drop-shadow-none md:border md:border-border md:rounded-3xl rounded-t-3xl gap-5 z-20">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="font-medium text-sm text-muted-foreground">
              Total Penukaran
            </p>
            <span className="font-medium">
              <strong className="text-primary text-2xl font-extrabold">
                {totalPoin.toLocaleString("id-ID")}
              </strong>{" "}
              Poin
            </span>
          </div>

          {totalItems > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
              {totalItems} barang
            </span>
          )}
        </div>

        <Button
          className="rounded-full h-11 w-full font-semibold cursor-pointer"
          disabled={
            isCartEmpty || !profile || !isPoinCukup || isPending || isSuccess
          }
          onClick={handleSimpanTukar}
        >
          {isPending || isSuccess ? (
            <Spinner />
          ) : profile && !isPoinCukup ? (
            "Poin Tidak Cukup"
          ) : (
            "Proses Penukaran"
          )}
        </Button>
      </div>
    </div>
  );
};

export default WarungPenukaran;
