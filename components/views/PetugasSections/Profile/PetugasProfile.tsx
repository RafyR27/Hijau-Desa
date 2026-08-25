"use client";

import ProfileLayout from "@/components/layouts/ProfileLayout/ProfileLayout";
import { SessionUser } from "@/types/user";

const PetugasProfile = ({ user }: { user?: SessionUser }) => {
  return <ProfileLayout user={user} />;
};

export default PetugasProfile;
