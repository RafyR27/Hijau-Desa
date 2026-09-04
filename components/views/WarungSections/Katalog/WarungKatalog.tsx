"use client";

import KatalogLayout from "@/components/layouts/KatalogLayout/KatalogLayout";
import { SessionUser } from "@/types/user";

interface WarungKatalogProps {
  user?: SessionUser;
}

const WarungKatalog = ({ user }: WarungKatalogProps) => {
  return <KatalogLayout user={user} />;
};

export default WarungKatalog;
