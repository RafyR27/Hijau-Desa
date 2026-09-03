import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PetugasPenimbangan from "@/components/views/PetugasSections/Penimbangan/PetugasPenimbangan";
import WarungPenukaran from "@/components/views/WarungSections/Penukaran/WarungPenukaran";
import instance from "@/lib/instance";
import { requireRole } from "@/lib/session";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PenukaranWarungPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    id?: string;
  }>;
}) {
  const session = await requireRole("warung");

  const cookieStore = await cookies();

  const { token, id } = await searchParams;

  if (!token || !id) {
    redirect("/warung/scan");
  }

  let profile;

  try {
    const res = await instance.get("/warga/verify", {
      params: {
        token,
        idUser: id,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    profile = res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        redirect("/warung/scan?error=not-found");
      }
    }

    console.error("Unexpected error:", error);

    redirect("/warung/scan?error=server");
  }

  return (
    <MainLayout user={session.user}>
      <WarungPenukaran profile={profile} token={token} wargaId={id} />
    </MainLayout>
  );
}
