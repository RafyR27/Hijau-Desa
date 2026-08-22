"use client";

import CardPoin from "@/components/commons/CardPoin/CardPoin";
import ProfileLayout from "@/components/layouts/ProfileLayout/ProfileLayout";
import { SessionUser } from "@/types/user";

const WargaProfile = ({ user }: { user?: SessionUser }) => {
  return (
    <ProfileLayout user={user}>
      <CardPoin className="hidden lg:block" />
    </ProfileLayout>
  );
};

export default WargaProfile;
