interface ItemTransaksiTukar {
  productId: number,
  namaProduct: string,
  qty: number,
}

interface TransaksiTukar {
  transaksiId: string;
  namaWarga: string;
  product: ItemTransaksiTukar[];
  totalPoin: number;
  createdAt: Date;
}

export type { TransaksiSetor, TransaksiTukar };
