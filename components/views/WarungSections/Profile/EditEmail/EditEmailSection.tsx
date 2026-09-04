import EditEmailLayout from "@/components/layouts/ProfileLayout/EditEmailLayout/EditEmailLayout";
import { SessionUser } from "@/types/user";

const EditEmailSection = ({ user }: { user: SessionUser }) => {
  return <EditEmailLayout user={user} />;
};

export default EditEmailSection;
