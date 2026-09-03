import WarungSuccess from "@/components/views/WarungSections/Success/WarungSuccess";
import instance from "@/lib/instance";
import { requireRole } from "@/lib/session";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PenukaranWarungSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    wargaId?: string;
    transaksiId?: string;
  }>;
}) {
  await requireRole("warung");

  const cookieStore = await cookies();

  const { token, wargaId, transaksiId } = await searchParams;

  if (!token || !wargaId || !transaksiId) {
    redirect("/warung/dashboard");
  }

  let transaksi;

  try {
    const res = await instance.get("/warung/success-verify", {
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
        redirect("/warung/dashboard?error=not-found");
      }
    }

    console.error("Unexpected error:", error);

    redirect("/warung/dashboard?error=server");
  }

  return <WarungSuccess transaksi={transaksi} />;
}