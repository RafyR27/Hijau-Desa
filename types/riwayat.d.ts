type RiwayatFilter = "all" | "in" | "out";

interface TransactionItem {
  id: string;
  type: "masuk" | "keluar";
  title: string;
  dateKey: string;
  monthYear: string;
  dateLabel: string;
  time: string;
  poin: string;
  weight?: string;
  status: string;
}

type Transaction =
  | {
      type: "in";
      id: number;
      namaKategori: string;
      beratKg: number;
      poinMasuk: number;
      createdAt: Date;
    }
  | {
      type: "out";
      id: number;
      namaProduct: string;
      poinKeluar: number;
      createdAt: Date;
    };

export type { RiwayatFilter, TransactionItem, Transaction };
