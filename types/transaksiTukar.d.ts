interface ItemTransaksiTukar {
  productId: number;
  namaProduct: string;
  qty: number;
}

interface TransaksiTukar {
  transaksiId: string;
  namaWarga: string;
  product: ItemTransaksiTukar[];
  totalPoin: number;
  createdAt: Date;
}

interface TransaksiTukarAdmin {
  id: string;
  jenis: string;
  warga: string;
  anggota: string;
  detailItem: string;
  poin: string;
  amountRupiah: number;
  createdAt: Date;
}

export type { TransaksiSetor, TransaksiTukar, TransaksiTukarAdmin };
