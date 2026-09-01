interface TransaksiSetor {
  transaksiId: number;
  namaWarga: string;
  kategoriSampah: string;
  beratSampah: number;
  rate: number;
  totalPoin: number;
  createdAt: Date;
}

export type { TransaksiSetor };
