interface TransaksiSetor {
  transaksiId: string;
  namaWarga: string;
  kategoriSampah: string;
  beratSampah: number;
  rate: number;
  totalPoin: number;
  createdAt: Date;
}

export type { TransaksiSetor };
