"use client";

import RiwayatLayout from "@/components/layouts/RiwayatLayout/RiwatatLayout";
import { SessionUser } from "@/types/user";

const WargaRiwayat = ({ user }: { user?: SessionUser }) => {
  return (
    <RiwayatLayout user={user} />
  );
};

export default WargaRiwayat;
