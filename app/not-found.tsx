import HomeLayout from "../components/layouts/HomeLayout/HomeLayout";
import NotFoundSection from "@/components/views/NotFoundSection/NotFoundSection";

export default function Home() {
  return (
    <HomeLayout>
      <NotFoundSection />
    </HomeLayout>
  );
}