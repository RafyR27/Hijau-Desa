interface TransaksiSetor {
  transaksiId: string;
  namaWarga: string;
  kategoriSampah: string;
  beratSampah: number;
  rate: number;
  totalPoin: number;
  createdAt: Date;
}

interface TransaksiSetorAdmin {
  id: string;
  jenis: string;
  warga: string;
  anggota: string;
  detailItem: string;
  poin: number;
  amountRupiah: number;
  createdAt: Date;
}

export type { TransaksiSetor, TransaksiSetorAdmin };
