"use client";

import KatalogLayout from "@/components/layouts/KatalogLayout/KatalogLayout";
import { SessionUser } from "@/types/user";

const WargaKatalog = ({ user }: { user?: SessionUser }) => {
  return <KatalogLayout user={user} />;
};

export default WargaKatalog;
