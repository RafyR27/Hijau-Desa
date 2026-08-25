import KatalogLayout from "@/components/layouts/KatalogLayout/KatalogLayout";
import { SessionUser } from "@/types/user";

const PetugasKatalog = ({ user }: { user?: SessionUser }) => {
  return <KatalogLayout user={user} />;
};

export default PetugasKatalog;
