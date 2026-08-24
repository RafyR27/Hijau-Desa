"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleStar, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CardPoin({className}: {className?: string}) {
  const route = usePathname();

  return (
    <Card
      className={cn("w-full flex  justify-center px-6 bg-primary rounded-2xl", className)}
    >
      <CardContent className="w-full px-0 flex flex-col justify-center items-center">
        <div className="flex flex-col gap-1 items-center text-primary-foreground">
          <h3 className="uppercase font-light md:text-[1rem]">
            total poin kamu
          </h3>
          <div className="flex items-center gap-2 text-[2rem]">
            <CircleStar size={35} />
            <p className="font-bold">10.000</p>
          </div>
        </div>

        {!route.includes("katalog") && !route.includes("profile") && (
          <div className="w-full md:max-w-45 mt-5 md:mt-10">
            <Button
              nativeButton={false}
              variant={"ghost"}
              className="bg-accent w-full hover:bg-accent/80"
              render={
                <Link
                  href={
                    route.includes("warga")
                      ? "/warga/katalog"
                      : route.includes("petugas")
                        ? "/petugas/katalog"
                        : "/warung/katalog"
                  }
                />
              }
            >
              <Package />
              Katalog Produk
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
