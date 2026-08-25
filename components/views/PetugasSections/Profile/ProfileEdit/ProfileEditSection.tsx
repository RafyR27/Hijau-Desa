import ProfileEditLayout from "@/components/layouts/ProfileLayout/ProfileEditLayout/ProfileEditLayout";
import { SessionUser } from "@/types/user";

const ProfileEditSection = ({ user }: { user: SessionUser }) => {
  return <ProfileEditLayout user={user} />;
};

export default ProfileEditSection;
