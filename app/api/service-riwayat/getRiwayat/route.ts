import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Endpoint: GET /api/service-riwayat/getRiwayat
 * Description: Mengambil riwayat poin masuk (penyetoran sampah) dan poin keluar (penukaran produk) dengan fitur filter.
 * Query Parameters:
 *   - filter (string): "semua" (default), "masuk", atau "keluar"
 *   - userId (string/number, opsional): Filter berdasarkan ID user tertentu jika diperlukan
 * Response Example:
 * {
 *   "success": true,
 *   "filter": "semua",
 *   "data": {
 *     "masuk": [
 *       {
 *         "id": 1,
 *         "type": "masuk",
 *         "kategoriSampah": "Plastik & Botol",
 *         "beratKg": 2.5,
 *         "poin": 50,
 *         "warga": { "id": 3, "name": "Budi" },
 *         "petugas": { "id": 2, "name": "Petugas A" },
 *         "createdAt": "..."
 *       }
 *     ],
 *     "keluar": [
 *       {
 *         "id": 1,
 *         "type": "keluar",
 *         "product": "Pupuk Organik",
 *         "jumlah": 1,
 *         "poinTerpakai": 30,
 *         "warga": { "id": 3, "name": "Budi" },
 *         "warung": { "id": 4, "name": "Warung Berkah" },
 *         "createdAt": "..."
 *       }
 *     ],
 *     "gabungan": [ ... diurutkan berdasarkan waktu terbaru ... ]
 *   }
 * }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get("filter") || "semua").toLowerCase();
    const userIdParam = searchParams.get("userId");
    const userId = userIdParam ? userIdParam : undefined;

    if (!["semua", "masuk", "keluar"].includes(filter)) {
      return NextResponse.json(
        { success: false, error: "Invalid filter parameter. Use 'semua', 'masuk', or 'keluar'." },
        { status: 400 }
      );
    }

    let transaksiSetorData: any[] = [];
    let transaksiTukarData: any[] = [];

    // Fetch Transaksi Setor (Poin Masuk) jika filter 'semua' atau 'masuk'
    if (filter === "semua" || filter === "masuk") {
      const whereClause = userId ? { wargaId: userId } : {};
      const setorList = await prisma.transaksiSetor.findMany({
        where: whereClause,
        include: {
          warga: { select: { id: true, name: true, noRumah: true } },
          petugas: { select: { id: true, name: true } },
          kategori: { select: { id: true, namaKategori: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      transaksiSetorData = setorList.map((item) => ({
        id: item.id,
        type: "masuk",
        kategoriSampah: item.kategori.namaKategori,
        beratKg: item.beratKg,
        poin: item.poinMasuk,
        warga: item.warga,
        petugas: item.petugas,
        createdAt: item.createdAt,
      }));
    }

    // Fetch Transaksi Tukar (Poin Keluar) jika filter 'semua' atau 'keluar'
    if (filter === "semua" || filter === "keluar") {
      const whereClause = userId ? { wargaId: userId } : {};
      const tukarList = await prisma.transaksiTukar.findMany({
        where: whereClause,
        include: {
          warga: { select: { id: true, name: true, noRumah: true } },
          warung: { select: { id: true, name: true } },
          product: { select: { id: true, namaProduct: true, hargaPoin: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      transaksiTukarData = tukarList.map((item) => ({
        id: item.id,
        type: "keluar",
        product: item.product.namaProduct,
        jumlah: 1,
        poinTerpakai: item.poinKeluar,
        warga: item.warga,
        warung: item.warung,
        createdAt: item.createdAt,
      }));
    }

    let responseData: any = {};

    if (filter === "masuk") {
      responseData = { masuk: transaksiSetorData };
    } else if (filter === "keluar") {
      responseData = { keluar: transaksiTukarData };
    } else {
      // Gabungkan dan urutkan berdasarkan createdAt secara descending (terbaru ke terlama)
      const gabungan = [...transaksiSetorData, [...transaksiTukarData]].flat().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      responseData = {
        masuk: transaksiSetorData,
        keluar: transaksiTukarData,
        gabungan,
      };
    }

    return NextResponse.json(
      {
        success: true,
        filter,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
