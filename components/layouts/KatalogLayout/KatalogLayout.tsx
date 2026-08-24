"use client";

import CardKatalog from "@/components/commons/CardKatalog/CardKatalog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SessionUser } from "@/types/user";
import { Search } from "lucide-react";

const KatalogLayout = ({ user, children }: { user?: SessionUser, children?: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex flex-col gap-7">
        {children}
      <InputGroup className="h-10">
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>

        <InputGroupInput placeholder="Cari barang untuk ditukar..." />
      </InputGroup>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <CardKatalog name="Beras 5Kg" image="/garbage-can.webp" poin="150" />
      </div>
    </div>
  );
};

export default KatalogLayout;
