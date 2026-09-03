import PetugasSuccess from "@/components/views/PetugasSections/Success/PetugasSuccess";
import instance from "@/lib/instance";
import { requireRole } from "@/lib/session";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PenimbanganPetugasSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    wargaId?: string;
    transaksiId?: string;
  }>;
}) {
  await requireRole("petugas");

  const cookieStore = await cookies();

  const { token, wargaId, transaksiId } = await searchParams;

  if (!token || !wargaId || !transaksiId) {
    redirect("/petugas/dashboard");
  }

  let transaksi;

  try {
    const res = await instance.get("/petugas/success-verify", {
      params: {
        token,
        wargaId,
        transaksiId,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    transaksi = res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        redirect("/petugas/dashboard?error=not-found");
      }
    }

    console.error("Unexpected error:", error);

    redirect("/petugas/dashboard?error=server");
  }

  return <PetugasSuccess transaksi={transaksi}/>;
}