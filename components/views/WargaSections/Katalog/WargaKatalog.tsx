"use client";

import CardPoin from "@/components/commons/CardPoin/CardPoin";
import KatalogLayout from "@/components/layouts/KatalogLayout/KatalogLayout";
import { SessionUser } from "@/types/user";


const WargaKatalog = ({ user }: { user?: SessionUser }) => {
  return (
    <KatalogLayout user={user}>
      <CardPoin />
    </KatalogLayout>
  );
};

export default WargaKatalog;
