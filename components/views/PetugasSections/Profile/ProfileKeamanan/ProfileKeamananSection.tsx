import ProfileKeamananLayout from "@/components/layouts/ProfileLayout/ProfileKeamananLayout/ProfileKeamananLayout";
import { SessionUser } from "@/types/user";

const ProfileKeamananSection = ({ user }: { user?: SessionUser }) => {
  return <ProfileKeamananLayout user={user} />;
};

export default ProfileKeamananSection;
