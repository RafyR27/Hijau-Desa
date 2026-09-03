"use client";

import ProfileLayout from "@/components/layouts/ProfileLayout/ProfileLayout";
import { SessionUser } from "@/types/user";

interface WarungProfileProps {
  user?: SessionUser;
}

const WarungProfile = ({ user }: WarungProfileProps) => {
  return <ProfileLayout user={user} />;
};

export default WarungProfile;
