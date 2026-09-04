type RiwayatFilter = "all" | "in" | "out" | "reimburse";

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
  reimbursementStatus?: boolean;
}

type Transaction =
  | {
      type: "in";
      id: string;
      namaKategori: string;
      beratKg: number;
      poinMasuk: number;
      createdAt: Date;
    }
  | {
      type: "out";
      id: string;
      products: string;
      poinKeluar: number;
      createdAt: Date;
    };


export type { RiwayatFilter, TransactionItem, Transaction};
